import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChecklistService } from '../checklist/checklist.service';
import { UnitStatus, AcceptanceStatus, AcceptanceDecision, ItemStatus, EventType } from '../common/enums';
import { StartAcceptanceDto } from './dto/start-acceptance.dto';
import { UpdateAcceptanceItemDto } from './dto/update-acceptance-item.dto';
import { SubmitAcceptanceDto } from './dto/submit-acceptance.dto';

@Injectable()
export class AcceptanceService {
  constructor(
    private prisma: PrismaService,
    private checklistService: ChecklistService,
  ) {}

  async findAll(options: { dealerId?: string; status?: AcceptanceStatus; page?: number; limit?: number }) {
    const { dealerId, status } = options;
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (dealerId) {
      where.unit = { dealerId };
    }
    if (status) {
      where.status = status;
    }

    const [records, total] = await Promise.all([
      this.prisma.acceptanceRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          unit: {
            include: { model: true, dealer: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { acceptanceItems: true, acceptancePhotos: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.acceptanceRecord.count({ where }),
    ]);

    return {
      data: records,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const record = await this.prisma.acceptanceRecord.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            model: true,
            dealer: true,
            pdiRecords: {
              orderBy: { completedAt: 'desc' },
              take: 1,
              include: {
                pdiItems: true,
              },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        acceptanceItems: {
          include: {
            checklistItem: {
              include: {
                category: true,
              },
            },
            acceptancePhotos: true,
          },
          orderBy: {
            checklistItem: { orderNum: 'asc' },
          },
        },
        acceptancePhotos: {
          where: { acceptanceItemId: null },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Acceptance record not found');
    }

    return record;
  }

  async findByVin(vin: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { vin },
      select: { id: true },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return this.prisma.acceptanceRecord.findMany({
      where: { unitId: unit.id },
      include: {
        user: {
          select: { id: true, name: true },
        },
        _count: {
          select: { acceptanceItems: true, acceptancePhotos: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async start(data: StartAcceptanceDto, userId: string, dealerId: string) {
    // Get unit
    const unit = await this.prisma.unit.findUnique({
      where: { vin: data.vin },
      include: { model: true },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check if unit belongs to this dealer
    if (unit.dealerId !== dealerId) {
      throw new ForbiddenException('Unit does not belong to your dealership');
    }

    // Check if unit has PDI complete
    if (unit.status === UnitStatus.PENDING_PDI) {
      throw new BadRequestException('Unit has not completed PDI');
    }

    // Check for existing in-progress acceptance
    const existingAcceptance = await this.prisma.acceptanceRecord.findFirst({
      where: {
        unitId: unit.id,
        status: AcceptanceStatus.IN_PROGRESS,
      },
    });

    if (existingAcceptance) {
      // Return existing acceptance to resume
      return this.findById(existingAcceptance.id);
    }

    // Get checklist template for this model
    const template = await this.checklistService.findForModel(unit.modelId || '');
    if (!template) {
      throw new BadRequestException('No checklist template found for this model');
    }

    // Create acceptance record with items
    const acceptance = await this.prisma.$transaction(async (tx) => {
      // Create acceptance record
      const record = await tx.acceptanceRecord.create({
        data: {
          unitId: unit.id,
          userId,
          deviceInfo: data.deviceInfo,
          locationData: data.locationData,
        },
      });

      // Create acceptance items from checklist
      const items: any[] = [];
      for (const category of template.categories) {
        for (const item of category.items) {
          items.push({
            acceptanceId: record.id,
            checklistItemId: item.id,
            status: ItemStatus.PENDING,
          });
        }
      }

      if (items.length > 0) {
        await tx.acceptanceItem.createMany({ data: items });
      }

      // Update unit status
      await tx.unit.update({
        where: { id: unit.id },
        data: { status: UnitStatus.IN_ACCEPTANCE },
      });

      // Create unit event
      await tx.unitEvent.create({
        data: {
          unitId: unit.id,
          eventType: EventType.ACCEPTANCE_STARTED,
          eventDate: new Date(),
          description: 'Dealer acceptance started',
          userId,
        },
      });

      return record;
    });

    return this.findById(acceptance.id);
  }

  async updateItem(acceptanceId: string, itemId: string, data: UpdateAcceptanceItemDto, userId: string) {
    const acceptance = await this.prisma.acceptanceRecord.findUnique({
      where: { id: acceptanceId },
    });

    if (!acceptance) {
      throw new NotFoundException('Acceptance record not found');
    }

    if (acceptance.status !== AcceptanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot modify completed acceptance');
    }

    const item = await this.prisma.acceptanceItem.findFirst({
      where: {
        id: itemId,
        acceptanceId,
      },
    });

    if (!item) {
      throw new NotFoundException('Acceptance item not found');
    }

    return this.prisma.acceptanceItem.update({
      where: { id: itemId },
      data: {
        status: data.status,
        notes: data.notes,
        isIssue: data.status === ItemStatus.ISSUE || data.status === ItemStatus.FAIL,
        issueSeverity: data.issueSeverity,
      },
      include: {
        checklistItem: true,
        acceptancePhotos: true,
      },
    });
  }

  async updateItems(acceptanceId: string, items: { id: string; status: ItemStatus; notes?: string }[]) {
    const acceptance = await this.prisma.acceptanceRecord.findUnique({
      where: { id: acceptanceId },
    });

    if (!acceptance) {
      throw new NotFoundException('Acceptance record not found');
    }

    if (acceptance.status !== AcceptanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot modify completed acceptance');
    }

    const updates = items.map((item) =>
      this.prisma.acceptanceItem.update({
        where: { id: item.id },
        data: {
          status: item.status,
          notes: item.notes,
          isIssue: item.status === ItemStatus.ISSUE || item.status === ItemStatus.FAIL,
        },
      })
    );

    await this.prisma.$transaction(updates);

    return this.findById(acceptanceId);
  }

  async submit(id: string, data: SubmitAcceptanceDto, userId: string, ipAddress?: string) {
    const acceptance = await this.findById(id);

    if (acceptance.status !== AcceptanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Acceptance already completed');
    }

    // Validate all required items are marked
    const pendingItems = acceptance.acceptanceItems.filter(
      (item) => item.status === ItemStatus.PENDING && item.checklistItem.required
    );

    if (pendingItems.length > 0) {
      throw new BadRequestException(
        `${pendingItems.length} required items are not yet marked. Please complete all required items.`
      );
    }

    // Check for issues without photos (if required)
    const issuesWithoutPhotos = acceptance.acceptanceItems.filter(
      (item) =>
        (item.status === ItemStatus.ISSUE || item.status === ItemStatus.FAIL) &&
        item.checklistItem.photoRequiredOnIssue &&
        item.acceptancePhotos.length === 0
    );

    if (issuesWithoutPhotos.length > 0) {
      throw new BadRequestException(
        `${issuesWithoutPhotos.length} issues require photos. Please add photos to flagged items.`
      );
    }

    // Determine new unit status based on decision
    const unitStatusMap: Record<AcceptanceDecision, UnitStatus> = {
      [AcceptanceDecision.FULL_ACCEPT]: UnitStatus.ACCEPTED,
      [AcceptanceDecision.CONDITIONAL]: UnitStatus.CONDITIONALLY_ACCEPTED,
      [AcceptanceDecision.REJECT]: UnitStatus.REJECTED,
      [AcceptanceDecision.ACCEPTED]: UnitStatus.ACCEPTED,
      [AcceptanceDecision.ACCEPTED_WITH_CONDITIONS]: UnitStatus.CONDITIONALLY_ACCEPTED,
      [AcceptanceDecision.REJECTED]: UnitStatus.REJECTED,
    };

    const result = await this.prisma.$transaction(async (tx) => {
      // Update acceptance record
      const updated = await tx.acceptanceRecord.update({
        where: { id },
        data: {
          status: AcceptanceStatus.COMPLETED,
          completedAt: new Date(),
          decision: data.decision,
          conditions: data.conditions ? JSON.stringify(data.conditions) : null,
          generalNotes: data.generalNotes,
          signatureData: data.signatureData,
          signatureTimestamp: new Date(),
          signatureIp: ipAddress,
        },
      });

      // Update unit status
      await tx.unit.update({
        where: { id: acceptance.unitId },
        data: { status: unitStatusMap[data.decision] },
      });

      // Create unit event
      await tx.unitEvent.create({
        data: {
          unitId: acceptance.unitId,
          eventType: EventType.ACCEPTANCE_COMPLETED,
          eventDate: new Date(),
          description: `Acceptance completed: ${data.decision}`,
          userId,
          metadata: JSON.stringify({ decision: data.decision, conditions: data.conditions }),
        },
      });

      return updated;
    });

    return this.findById(result.id);
  }

  async cancel(id: string, userId: string) {
    const acceptance = await this.findById(id);

    if (acceptance.status !== AcceptanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Can only cancel in-progress acceptance');
    }

    return this.prisma.$transaction(async (tx) => {
      // Update acceptance
      await tx.acceptanceRecord.update({
        where: { id },
        data: { status: AcceptanceStatus.CANCELLED },
      });

      // Revert unit status
      await tx.unit.update({
        where: { id: acceptance.unitId },
        data: { status: UnitStatus.RECEIVED },
      });

      return { message: 'Acceptance cancelled' };
    });
  }

  async getProgress(id: string) {
    const acceptance = await this.findById(id);

    const items = acceptance.acceptanceItems;
    const total = items.length;
    const completed = items.filter((i) => i.status !== ItemStatus.PENDING).length;
    const passed = items.filter((i) => i.status === ItemStatus.PASS).length;
    const issues = items.filter((i) => i.status === ItemStatus.ISSUE).length;
    const failed = items.filter((i) => i.status === ItemStatus.FAIL).length;
    const skipped = items.filter((i) => i.status === ItemStatus.NA).length;

    // Group by category
    const byCategory = items.reduce((acc: any, item) => {
      const catName = item.checklistItem.category.name;
      if (!acc[catName]) {
        acc[catName] = { total: 0, completed: 0, passed: 0, issues: 0, failed: 0 };
      }
      acc[catName].total++;
      if (item.status !== ItemStatus.PENDING) acc[catName].completed++;
      if (item.status === ItemStatus.PASS) acc[catName].passed++;
      if (item.status === ItemStatus.ISSUE) acc[catName].issues++;
      if (item.status === ItemStatus.FAIL) acc[catName].failed++;
      return acc;
    }, {});

    return {
      acceptanceId: id,
      total,
      completed,
      passed,
      issues,
      failed,
      skipped,
      percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
      photoCount: acceptance.acceptancePhotos.length +
        items.reduce((sum, i) => sum + i.acceptancePhotos.length, 0),
    };
  }

  async getSummary(id: string) {
    const acceptance = await this.findById(id);
    const progress = await this.getProgress(id);

    return {
      acceptance: {
        id: acceptance.id,
        status: acceptance.status,
        decision: acceptance.decision,
        startedAt: acceptance.startedAt,
        completedAt: acceptance.completedAt,
      },
      unit: {
        vin: acceptance.unit.vin,
        model: acceptance.unit.model?.name,
        year: acceptance.unit.modelYear,
      },
      inspector: acceptance.user,
      progress,
      issues: acceptance.acceptanceItems
        .filter((i) => i.status === ItemStatus.ISSUE || i.status === ItemStatus.FAIL)
        .map((i) => ({
          id: i.id,
          code: i.checklistItem.code,
          description: i.checklistItem.description,
          status: i.status,
          severity: i.issueSeverity,
          notes: i.notes,
          photoCount: i.acceptancePhotos.length,
        })),
      conditions: acceptance.conditions,
    };
  }
}
