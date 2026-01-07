import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UnitStatus,
  EventType,
  ItemStatus,
  ManufacturerInspectionStatus,
  ChecklistTemplateType,
} from '../common/enums';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { UpdateInspectionItemDto, BulkUpdateInspectionItemsDto } from './dto/update-inspection-item.dto';
import { CompleteInspectionDto, ApproveInspectionDto, RejectInspectionDto } from './dto/complete-inspection.dto';

@Injectable()
export class ManufacturerInspectionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Start a new inspection for a unit
   */
  async startInspection(dto: StartInspectionDto, inspectorId: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.unitId },
      include: { model: true },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Check unit is in correct status
    if (unit.status !== UnitStatus.PENDING_INSPECTION) {
      throw new BadRequestException(`Cannot start inspection for unit in status: ${unit.status}`);
    }

    // Check for existing in-progress inspection
    const existingInspection = await this.prisma.manufacturerInspectionRecord.findFirst({
      where: {
        unitId: dto.unitId,
        status: ManufacturerInspectionStatus.IN_PROGRESS,
      },
    });

    if (existingInspection) {
      throw new BadRequestException('Unit already has an inspection in progress');
    }

    // Get the manufacturer checklist template
    let template = dto.templateId
      ? await this.prisma.checklistTemplate.findUnique({
          where: { id: dto.templateId },
          include: {
            categories: {
              include: { items: true },
              orderBy: { orderNum: 'asc' },
            },
          },
        })
      : await this.findDefaultTemplate(unit.modelId, ChecklistTemplateType.MANUFACTURER);

    if (!template) {
      throw new BadRequestException('No checklist template found for this model');
    }

    // Create inspection with items in a transaction
    const inspection = await this.prisma.$transaction(async (tx) => {
      // Create the inspection record
      const inspectionRecord = await tx.manufacturerInspectionRecord.create({
        data: {
          unitId: dto.unitId,
          inspectorId,
          status: ManufacturerInspectionStatus.IN_PROGRESS,
        },
      });

      // Create inspection items from template
      const allItems = template.categories.flatMap((cat) => cat.items);
      await tx.manufacturerInspectionItem.createMany({
        data: allItems.map((item) => ({
          inspectionId: inspectionRecord.id,
          checklistItemId: item.id,
          status: ItemStatus.PENDING,
        })),
      });

      // Update unit status
      await tx.unit.update({
        where: { id: dto.unitId },
        data: { status: UnitStatus.INSPECTION_IN_PROGRESS },
      });

      // Create event
      await tx.unitEvent.create({
        data: {
          unitId: dto.unitId,
          eventType: EventType.INSPECTION_STARTED,
          eventDate: new Date(),
          description: 'Manufacturer inspection started',
          userId: inspectorId,
        },
      });

      return inspectionRecord;
    });

    return this.getInspectionById(inspection.id);
  }

  /**
   * Get inspection by ID with all details
   */
  async getInspectionById(id: string) {
    const inspection = await this.prisma.manufacturerInspectionRecord.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            model: true,
            dealer: { select: { id: true, name: true, code: true } },
          },
        },
        inspector: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        manufacturerInspectionItems: {
          include: {
            checklistItem: {
              include: {
                category: true,
              },
            },
            manufacturerInspectionPhotos: true,
            itemNotes: {
              where: { visibleToManufacturer: true },
              include: { author: { select: { id: true, name: true } } },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: {
            checklistItem: { orderNum: 'asc' },
          },
        },
        manufacturerInspectionPhotos: true,
      },
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    // Calculate progress
    const items = inspection.manufacturerInspectionItems;
    const totalItems = items.length;
    const completedItems = items.filter((i) => i.status !== ItemStatus.PENDING).length;
    const passedItems = items.filter((i) => i.status === ItemStatus.PASS).length;
    const failedItems = items.filter((i) => i.status === ItemStatus.FAIL).length;
    const issueItems = items.filter((i) => i.status === ItemStatus.ISSUE).length;

    return {
      ...inspection,
      progress: {
        totalItems,
        completedItems,
        passedItems,
        failedItems,
        issueItems,
        percentComplete: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      },
    };
  }

  /**
   * Get inspection for a unit
   */
  async getInspectionByUnitId(unitId: string) {
    const inspection = await this.prisma.manufacturerInspectionRecord.findFirst({
      where: { unitId },
      orderBy: { createdAt: 'desc' },
    });

    if (!inspection) {
      throw new NotFoundException('No inspection found for this unit');
    }

    return this.getInspectionById(inspection.id);
  }

  /**
   * Update a single inspection item
   */
  async updateInspectionItem(
    inspectionId: string,
    itemId: string,
    dto: UpdateInspectionItemDto,
    userId: string
  ) {
    const inspection = await this.prisma.manufacturerInspectionRecord.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    if (inspection.status !== ManufacturerInspectionStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot update items on a completed inspection');
    }

    const item = await this.prisma.manufacturerInspectionItem.findFirst({
      where: { id: itemId, inspectionId },
    });

    if (!item) {
      throw new NotFoundException('Inspection item not found');
    }

    return this.prisma.manufacturerInspectionItem.update({
      where: { id: itemId },
      data: {
        status: dto.status,
        notes: dto.notes,
        isIssue: dto.isIssue ?? (dto.status === ItemStatus.ISSUE || dto.status === ItemStatus.FAIL),
        issueSeverity: dto.issueSeverity,
      },
      include: {
        checklistItem: true,
        manufacturerInspectionPhotos: true,
      },
    });
  }

  /**
   * Bulk update inspection items
   */
  async bulkUpdateItems(inspectionId: string, dto: BulkUpdateInspectionItemsDto, userId: string) {
    const inspection = await this.prisma.manufacturerInspectionRecord.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    if (inspection.status !== ManufacturerInspectionStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot update items on a completed inspection');
    }

    const results = await Promise.all(
      dto.items.map((item) =>
        this.prisma.manufacturerInspectionItem.update({
          where: { id: item.itemId },
          data: {
            status: item.status,
            notes: item.notes,
            isIssue: item.isIssue ?? (item.status === ItemStatus.ISSUE || item.status === ItemStatus.FAIL),
            issueSeverity: item.issueSeverity,
          },
        })
      )
    );

    return { updated: results.length };
  }

  /**
   * Complete the inspection (mark as ready for approval)
   */
  async completeInspection(inspectionId: string, dto: CompleteInspectionDto, userId: string) {
    const inspection = await this.getInspectionById(inspectionId);

    if (inspection.status !== ManufacturerInspectionStatus.IN_PROGRESS) {
      throw new BadRequestException('Inspection is not in progress');
    }

    // Check all required items are completed
    const pendingItems = inspection.manufacturerInspectionItems.filter(
      (i) => i.status === ItemStatus.PENDING && i.checklistItem.required
    );

    if (pendingItems.length > 0) {
      throw new BadRequestException(
        `${pendingItems.length} required items are not completed`
      );
    }

    // Calculate final stats
    const items = inspection.manufacturerInspectionItems;
    const totalItems = items.length;
    const passedItems = items.filter((i) => i.status === ItemStatus.PASS).length;
    const failedItems = items.filter((i) => i.status === ItemStatus.FAIL).length;
    const issueItems = items.filter((i) => i.status === ItemStatus.ISSUE).length;

    return this.prisma.$transaction(async (tx) => {
      // Update inspection record
      const updatedInspection = await tx.manufacturerInspectionRecord.update({
        where: { id: inspectionId },
        data: {
          status: ManufacturerInspectionStatus.COMPLETED,
          completedAt: new Date(),
          generalNotes: dto.generalNotes,
          signatureData: dto.signatureData,
          signatureTimestamp: dto.signatureData ? new Date() : null,
          totalItems,
          passedItems,
          failedItems,
          issueItems,
        },
      });

      // Update unit status
      await tx.unit.update({
        where: { id: inspection.unitId },
        data: {
          status: UnitStatus.PENDING_APPROVAL,
          inspectionCompletedAt: new Date(),
        },
      });

      // Create event
      await tx.unitEvent.create({
        data: {
          unitId: inspection.unitId,
          eventType: EventType.INSPECTION_COMPLETED,
          eventDate: new Date(),
          description: `Inspection completed: ${passedItems} passed, ${failedItems} failed, ${issueItems} issues`,
          userId,
          metadata: JSON.stringify({ totalItems, passedItems, failedItems, issueItems }),
        },
      });

      return this.getInspectionById(inspectionId);
    });
  }

  /**
   * Approve the inspection (unit ready to ship)
   */
  async approveInspection(inspectionId: string, dto: ApproveInspectionDto, approverId: string) {
    const inspection = await this.getInspectionById(inspectionId);

    if (inspection.status !== ManufacturerInspectionStatus.COMPLETED) {
      throw new BadRequestException('Inspection must be completed before approval');
    }

    return this.prisma.$transaction(async (tx) => {
      // Update inspection
      await tx.manufacturerInspectionRecord.update({
        where: { id: inspectionId },
        data: {
          status: ManufacturerInspectionStatus.APPROVED,
          approvedAt: new Date(),
          approvedById: approverId,
        },
      });

      // Update unit
      await tx.unit.update({
        where: { id: inspection.unitId },
        data: {
          status: UnitStatus.APPROVED,
          approvedAt: new Date(),
          approvedById: approverId,
        },
      });

      // Create event
      await tx.unitEvent.create({
        data: {
          unitId: inspection.unitId,
          eventType: EventType.INSPECTION_APPROVED,
          eventDate: new Date(),
          description: 'Inspection approved, unit ready to ship',
          userId: approverId,
          metadata: dto.approvalNotes ? JSON.stringify({ notes: dto.approvalNotes }) : null,
        },
      });

      return this.getInspectionById(inspectionId);
    });
  }

  /**
   * Reject the inspection (needs rework)
   */
  async rejectInspection(inspectionId: string, dto: RejectInspectionDto, userId: string) {
    const inspection = await this.getInspectionById(inspectionId);

    if (inspection.status !== ManufacturerInspectionStatus.COMPLETED) {
      throw new BadRequestException('Inspection must be completed before rejection');
    }

    return this.prisma.$transaction(async (tx) => {
      // Update inspection
      await tx.manufacturerInspectionRecord.update({
        where: { id: inspectionId },
        data: {
          status: ManufacturerInspectionStatus.REJECTED,
        },
      });

      // Reset unit status to allow new inspection
      await tx.unit.update({
        where: { id: inspection.unitId },
        data: {
          status: UnitStatus.PENDING_INSPECTION,
        },
      });

      // Create event
      await tx.unitEvent.create({
        data: {
          unitId: inspection.unitId,
          eventType: EventType.INSPECTION_REJECTED,
          eventDate: new Date(),
          description: `Inspection rejected: ${dto.rejectionReason}`,
          userId,
          metadata: JSON.stringify({ reason: dto.rejectionReason }),
        },
      });

      return this.getInspectionById(inspectionId);
    });
  }

  /**
   * Ship the unit (makes it visible to dealer)
   */
  async shipUnit(unitId: string, userId: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.status !== UnitStatus.APPROVED) {
      throw new BadRequestException('Unit must be approved before shipping');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedUnit = await tx.unit.update({
        where: { id: unitId },
        data: {
          status: UnitStatus.SHIPPED,
          shippedAt: new Date(),
          shippedById: userId,
          shipDate: new Date(),
        },
        include: {
          model: true,
          dealer: true,
        },
      });

      await tx.unitEvent.create({
        data: {
          unitId,
          eventType: EventType.SHIPPED,
          eventDate: new Date(),
          description: 'Unit shipped to dealer - now visible to dealer',
          userId,
        },
      });

      return updatedUnit;
    });
  }

  /**
   * List all inspections with filters
   */
  async findAll(options: {
    status?: ManufacturerInspectionStatus;
    inspectorId?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, inspectorId, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (inspectorId) where.inspectorId = inspectorId;

    const [inspections, total] = await Promise.all([
      this.prisma.manufacturerInspectionRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          unit: {
            include: {
              model: true,
              dealer: { select: { id: true, name: true, code: true } },
            },
          },
          inspector: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.manufacturerInspectionRecord.count({ where }),
    ]);

    return {
      data: inspections,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get units pending inspection (for manufacturer dashboard)
   */
  async getUnitsPendingInspection() {
    return this.prisma.unit.findMany({
      where: {
        status: UnitStatus.PENDING_INSPECTION,
      },
      include: {
        model: true,
        dealer: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get units pending approval
   */
  async getUnitsPendingApproval() {
    return this.prisma.unit.findMany({
      where: {
        status: UnitStatus.PENDING_APPROVAL,
      },
      include: {
        model: true,
        dealer: { select: { id: true, name: true, code: true } },
        manufacturerInspectionRecords: {
          where: { status: ManufacturerInspectionStatus.COMPLETED },
          orderBy: { completedAt: 'desc' },
          take: 1,
          include: {
            inspector: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get units ready to ship
   */
  async getUnitsReadyToShip() {
    return this.prisma.unit.findMany({
      where: {
        status: UnitStatus.APPROVED,
      },
      include: {
        model: true,
        dealer: { select: { id: true, name: true, code: true } },
      },
      orderBy: { approvedAt: 'desc' },
    });
  }

  /**
   * Find default template for a model
   */
  private async findDefaultTemplate(modelId: string | null, templateType: ChecklistTemplateType) {
    // First try to find model-specific template
    if (modelId) {
      const modelTemplate = await this.prisma.checklistTemplate.findFirst({
        where: {
          active: true,
          templateType,
          modelIds: { contains: modelId },
        },
        include: {
          categories: {
            include: { items: true },
            orderBy: { orderNum: 'asc' },
          },
        },
        orderBy: { version: 'desc' },
      });

      if (modelTemplate) return modelTemplate;
    }

    // Fall back to generic template
    return this.prisma.checklistTemplate.findFirst({
      where: {
        active: true,
        templateType,
        OR: [{ modelIds: null }, { modelIds: '' }],
      },
      include: {
        categories: {
          include: { items: true },
          orderBy: { orderNum: 'asc' },
        },
      },
      orderBy: { version: 'desc' },
    });
  }
}
