import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnitStatus, EventType } from '../common/enums';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

interface ListUnitsOptions {
  dealerId?: string;
  status?: UnitStatus | UnitStatus[];
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: ListUnitsOptions) {
    const { dealerId, status, search, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (dealerId) {
      where.dealerId = dealerId;
    }

    if (status) {
      where.status = Array.isArray(status) ? { in: status } : status;
    }

    if (search) {
      where.OR = [
        { vin: { contains: search, mode: 'insensitive' } },
        { stockNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        skip,
        take: limit,
        include: {
          model: true,
          dealer: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          pdiRecords: {
            orderBy: { completedAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              completedAt: true,
              totalItems: true,
              passedItems: true,
              failedItems: true,
            },
          },
          acceptanceRecords: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              decision: true,
              completedAt: true,
            },
          },
        },
        orderBy: { receiveDate: 'desc' },
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      data: units,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByVin(vin: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { vin },
      include: {
        model: true,
        dealer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        unitOptions: {
          include: {
            option: true,
          },
        },
        pdiRecords: {
          orderBy: { completedAt: 'desc' },
          include: {
            pdiItems: {
              include: {
                pdiPhotos: true,
              },
            },
            pdiPhotos: true,
          },
        },
        acceptanceRecords: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        unitEvents: {
          orderBy: { eventDate: 'desc' },
          take: 20,
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return unit;
  }

  async findById(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        model: true,
        dealer: true,
        unitOptions: {
          include: { option: true },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return unit;
  }

  async create(data: CreateUnitDto) {
    // Validate VIN format (17 characters)
    if (!this.isValidVin(data.vin)) {
      throw new BadRequestException('Invalid VIN format');
    }

    // Check if VIN already exists
    const existingUnit = await this.prisma.unit.findUnique({
      where: { vin: data.vin },
    });

    if (existingUnit) {
      throw new BadRequestException('Unit with this VIN already exists');
    }

    const unit = await this.prisma.unit.create({
      data: {
        vin: data.vin,
        stockNumber: data.stockNumber,
        dealerId: data.dealerId,
        modelId: data.modelId,
        modelYear: data.modelYear,
        exteriorColor: data.exteriorColor,
        interiorColor: data.interiorColor,
        chassisType: data.chassisType,
        engineType: data.engineType,
        gvwr: data.gvwr,
        shipDate: data.shipDate,
        receiveDate: data.receiveDate,
        status: data.status || UnitStatus.PENDING_PDI,
      },
      include: {
        model: true,
        dealer: true,
      },
    });

    // Create initial unit event
    await this.createUnitEvent(unit.id, EventType.MANUFACTURED, 'Unit created in system');

    return unit;
  }

  async update(id: string, data: UpdateUnitDto) {
    const unit = await this.findById(id);

    return this.prisma.unit.update({
      where: { id },
      data,
      include: {
        model: true,
        dealer: true,
      },
    });
  }

  async updateStatus(id: string, status: UnitStatus, userId?: string) {
    const unit = await this.findById(id);

    await this.prisma.unit.update({
      where: { id },
      data: { status },
    });

    // Map status to event type
    const eventTypeMap: Partial<Record<UnitStatus, EventType>> = {
      [UnitStatus.PDI_COMPLETE]: EventType.PDI_COMPLETED,
      [UnitStatus.SHIPPED]: EventType.SHIPPED,
      [UnitStatus.RECEIVED]: EventType.RECEIVED,
      [UnitStatus.IN_ACCEPTANCE]: EventType.ACCEPTANCE_STARTED,
      [UnitStatus.ACCEPTED]: EventType.ACCEPTANCE_COMPLETED,
      [UnitStatus.CONDITIONALLY_ACCEPTED]: EventType.ACCEPTANCE_COMPLETED,
      [UnitStatus.REJECTED]: EventType.ACCEPTANCE_COMPLETED,
    };

    const eventType = eventTypeMap[status];
    if (eventType) {
      await this.createUnitEvent(id, eventType, `Status changed to ${status}`, userId);
    }

    return this.findById(id);
  }

  async markReceived(id: string, userId?: string) {
    const unit = await this.findById(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.unit.update({
        where: { id },
        data: {
          status: UnitStatus.RECEIVED,
          receiveDate: new Date(),
        },
      });

      await tx.unitEvent.create({
        data: {
          unitId: id,
          eventType: EventType.RECEIVED,
          eventDate: new Date(),
          description: 'Unit received at dealership',
          userId,
        },
      });

      return tx.unit.findUnique({
        where: { id },
        include: { model: true, dealer: true },
      });
    });
  }

  async getHistory(vin: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { vin },
      select: { id: true },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return this.prisma.unitEvent.findMany({
      where: { unitId: unit.id },
      orderBy: { eventDate: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  private async createUnitEvent(
    unitId: string,
    eventType: EventType,
    description: string,
    userId?: string
  ) {
    return this.prisma.unitEvent.create({
      data: {
        unitId,
        eventType,
        eventDate: new Date(),
        description,
        userId,
        source: 'system',
      },
    });
  }

  private isValidVin(vin: string): boolean {
    // VIN must be 17 characters and contain only valid characters
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return vinRegex.test(vin);
  }

  // Pending acceptance units for a dealer
  async getPendingUnits(dealerId: string) {
    return this.prisma.unit.findMany({
      where: {
        dealerId,
        status: {
          in: [UnitStatus.RECEIVED, UnitStatus.PDI_COMPLETE, UnitStatus.PDI_ISSUES],
        },
      },
      include: {
        model: true,
        pdiRecords: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { receiveDate: 'desc' },
    });
  }

  // In-progress acceptance units for a dealer
  async getInProgressUnits(dealerId: string) {
    return this.prisma.unit.findMany({
      where: {
        dealerId,
        status: UnitStatus.IN_ACCEPTANCE,
      },
      include: {
        model: true,
        acceptanceRecords: {
          where: { status: 'IN_PROGRESS' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            user: {
              select: { name: true },
            },
            _count: {
              select: { acceptanceItems: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
