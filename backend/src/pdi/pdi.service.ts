import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnitsService } from '../units/units.service';
import { UnitStatus, EventType, PdiStatus, ItemStatus } from '../common/enums';
import { CreatePdiDto } from './dto/create-pdi.dto';
import { UpdatePdiItemDto } from './dto/update-pdi-item.dto';

@Injectable()
export class PdiService {
  constructor(
    private prisma: PrismaService,
    private unitsService: UnitsService,
  ) {}

  async findByUnitVin(vin: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { vin },
      select: { id: true },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return this.prisma.pdiRecord.findMany({
      where: { unitId: unit.id },
      include: {
        pdiItems: {
          include: {
            pdiPhotos: true,
          },
          orderBy: { itemCode: 'asc' },
        },
        pdiPhotos: {
          where: { pdiItemId: null },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  async findById(id: string) {
    const pdiRecord = await this.prisma.pdiRecord.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            model: true,
            dealer: true,
          },
        },
        pdiItems: {
          include: {
            pdiPhotos: true,
          },
          orderBy: { itemCode: 'asc' },
        },
        pdiPhotos: true,
      },
    });

    if (!pdiRecord) {
      throw new NotFoundException('PDI record not found');
    }

    return pdiRecord;
  }

  async create(vin: string, data: CreatePdiDto) {
    // Find the unit
    const unit = await this.prisma.unit.findUnique({
      where: { vin },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Create PDI record with items
    const pdiRecord = await this.prisma.$transaction(async (tx) => {
      // Calculate passed/failed counts
      const passedItems = data.items?.filter(i => i.status === ItemStatus.PASS).length || 0;
      const failedItems = data.items?.filter(i => i.status === ItemStatus.FAIL || i.status === ItemStatus.ISSUE).length || 0;

      const record = await tx.pdiRecord.create({
        data: {
          unitId: unit.id,
          inspectorId: data.inspectorId,
          inspectorName: data.inspectorName,
          completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
          status: failedItems > 0 ? PdiStatus.ISSUES_PENDING : PdiStatus.COMPLETE,
          totalItems: data.items?.length || 0,
          passedItems,
          failedItems,
          notes: data.notes,
        },
      });

      // Create PDI items if provided
      if (data.items && data.items.length > 0) {
        await tx.pdiItem.createMany({
          data: data.items.map((item) => ({
            pdiId: record.id,
            itemCode: item.itemCode,
            itemDescription: item.itemDescription,
            status: item.status,
            notes: item.notes,
            resolved: item.resolved || false,
            resolvedBy: item.resolvedBy,
            resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : null,
            resolutionNotes: item.resolutionNotes,
          })),
        });
      }

      // Update unit status
      const newStatus = failedItems > 0 && data.items?.some(i => !i.resolved)
        ? UnitStatus.PDI_ISSUES
        : UnitStatus.PDI_COMPLETE;

      await tx.unit.update({
        where: { id: unit.id },
        data: { status: newStatus },
      });

      // Create unit event
      await tx.unitEvent.create({
        data: {
          unitId: unit.id,
          eventType: EventType.PDI_COMPLETED,
          eventDate: new Date(),
          description: `PDI completed by ${data.inspectorName || 'Inspector'}. ${passedItems} passed, ${failedItems} issues.`,
          source: 'pdi-system',
        },
      });

      return record;
    });

    return this.findById(pdiRecord.id);
  }

  async updateItem(pdiItemId: string, data: UpdatePdiItemDto) {
    const pdiItem = await this.prisma.pdiItem.findUnique({
      where: { id: pdiItemId },
      include: { pdiRecord: true },
    });

    if (!pdiItem) {
      throw new NotFoundException('PDI item not found');
    }

    const updatedItem = await this.prisma.pdiItem.update({
      where: { id: pdiItemId },
      data: {
        status: data.status,
        notes: data.notes,
        resolved: data.resolved,
        resolvedBy: data.resolvedBy,
        resolvedAt: data.resolved ? new Date() : null,
        resolutionNotes: data.resolutionNotes,
      },
    });

    // Recalculate PDI record counts
    const items = await this.prisma.pdiItem.findMany({
      where: { pdiId: pdiItem.pdiId },
    });

    const passedItems = items.filter(i => i.status === ItemStatus.PASS).length;
    const failedItems = items.filter(i => i.status === ItemStatus.FAIL || i.status === ItemStatus.ISSUE).length;
    const unresolvedIssues = items.filter(
      i => (i.status === ItemStatus.FAIL || i.status === ItemStatus.ISSUE) && !i.resolved
    ).length;

    await this.prisma.pdiRecord.update({
      where: { id: pdiItem.pdiId },
      data: {
        passedItems,
        failedItems,
        status: unresolvedIssues > 0 ? PdiStatus.ISSUES_PENDING : PdiStatus.COMPLETE,
      },
    });

    // Update unit status if all issues resolved
    if (unresolvedIssues === 0) {
      await this.prisma.unit.update({
        where: { id: pdiItem.pdiRecord.unitId },
        data: { status: UnitStatus.PDI_COMPLETE },
      });
    }

    return updatedItem;
  }

  async getSummary(pdiId: string) {
    const pdiRecord = await this.findById(pdiId);

    const categoryStats = pdiRecord.pdiItems.reduce((acc: any, item) => {
      const category = item.itemCode?.split('.')[0] || 'uncategorized';
      if (!acc[category]) {
        acc[category] = { total: 0, passed: 0, failed: 0, issues: 0 };
      }
      acc[category].total++;
      if (item.status === ItemStatus.PASS) acc[category].passed++;
      if (item.status === ItemStatus.FAIL) acc[category].failed++;
      if (item.status === ItemStatus.ISSUE) acc[category].issues++;
      return acc;
    }, {});

    return {
      pdiId: pdiRecord.id,
      unitId: pdiRecord.unitId,
      completedAt: pdiRecord.completedAt,
      inspector: pdiRecord.inspectorName,
      status: pdiRecord.status,
      summary: {
        total: pdiRecord.totalItems,
        passed: pdiRecord.passedItems,
        failed: pdiRecord.failedItems,
      },
      categoryStats,
      issues: pdiRecord.pdiItems.filter(
        i => i.status === ItemStatus.FAIL || i.status === ItemStatus.ISSUE
      ),
      photoCount: pdiRecord.pdiPhotos.length + pdiRecord.pdiItems.reduce(
        (sum, item) => sum + item.pdiPhotos.length, 0
      ),
    };
  }
}
