import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChecklistTemplateDto } from './dto/create-checklist-template.dto';
import { UpdateChecklistTemplateDto } from './dto/update-checklist-template.dto';

@Injectable()
export class ChecklistService {
  constructor(private prisma: PrismaService) {}

  async findAll(active?: boolean) {
    return this.prisma.checklistTemplate.findMany({
      where: active !== undefined ? { active } : undefined,
      include: {
        categories: {
          orderBy: { orderNum: 'asc' },
          include: {
            _count: {
              select: { items: true },
            },
          },
        },
        createdBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    const template = await this.prisma.checklistTemplate.findUnique({
      where: { id },
      include: {
        categories: {
          orderBy: { orderNum: 'asc' },
          include: {
            items: {
              orderBy: { orderNum: 'asc' },
            },
          },
        },
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Checklist template not found');
    }

    return template;
  }

  async findForModel(modelId: string) {
    // Find active templates that apply to this model
    return this.prisma.checklistTemplate.findFirst({
      where: {
        active: true,
        OR: [
          { modelIds: { has: modelId } },
          { modelIds: { isEmpty: true } }, // Default template for all models
        ],
      },
      include: {
        categories: {
          orderBy: { orderNum: 'asc' },
          include: {
            items: {
              orderBy: { orderNum: 'asc' },
            },
          },
        },
      },
      orderBy: { version: 'desc' },
    });
  }

  async create(data: CreateChecklistTemplateDto, userId?: string) {
    const template = await this.prisma.checklistTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        modelIds: data.modelIds || [],
        createdById: userId,
        categories: {
          create: data.categories?.map((cat, catIndex) => ({
            name: cat.name,
            code: cat.code,
            description: cat.description,
            orderNum: catIndex + 1,
            required: cat.required ?? true,
            items: {
              create: cat.items?.map((item, itemIndex) => ({
                code: item.code,
                description: item.description,
                instructions: item.instructions,
                orderNum: itemIndex + 1,
                required: item.required ?? true,
                photoRequired: item.photoRequired ?? false,
                photoRequiredOnIssue: item.photoRequiredOnIssue ?? true,
                conditionLogic: item.conditionLogic,
              })),
            },
          })),
        },
      },
      include: {
        categories: {
          include: { items: true },
        },
      },
    });

    return template;
  }

  async update(id: string, data: UpdateChecklistTemplateDto) {
    const template = await this.findById(id);

    return this.prisma.checklistTemplate.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        modelIds: data.modelIds,
        active: data.active,
      },
    });
  }

  async addCategory(templateId: string, data: any) {
    const template = await this.findById(templateId);

    // Get next order number
    const maxOrder = await this.prisma.checklistCategory.aggregate({
      where: { templateId },
      _max: { orderNum: true },
    });

    return this.prisma.checklistCategory.create({
      data: {
        templateId,
        name: data.name,
        code: data.code,
        description: data.description,
        orderNum: (maxOrder._max.orderNum || 0) + 1,
        required: data.required ?? true,
      },
    });
  }

  async addItem(categoryId: string, data: any) {
    const category = await this.prisma.checklistCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Get next order number
    const maxOrder = await this.prisma.checklistItem.aggregate({
      where: { categoryId },
      _max: { orderNum: true },
    });

    return this.prisma.checklistItem.create({
      data: {
        categoryId,
        code: data.code,
        description: data.description,
        instructions: data.instructions,
        orderNum: (maxOrder._max.orderNum || 0) + 1,
        required: data.required ?? true,
        photoRequired: data.photoRequired ?? false,
        photoRequiredOnIssue: data.photoRequiredOnIssue ?? true,
        conditionLogic: data.conditionLogic,
      },
    });
  }

  async duplicate(id: string, newName: string, userId?: string) {
    const template = await this.findById(id);

    const duplicated = await this.prisma.checklistTemplate.create({
      data: {
        name: newName,
        description: template.description,
        modelIds: template.modelIds,
        createdById: userId,
        categories: {
          create: template.categories.map((cat) => ({
            name: cat.name,
            code: cat.code,
            description: cat.description,
            orderNum: cat.orderNum,
            required: cat.required,
            items: {
              create: cat.items.map((item) => ({
                code: item.code,
                description: item.description,
                instructions: item.instructions,
                orderNum: item.orderNum,
                required: item.required,
                photoRequired: item.photoRequired,
                photoRequiredOnIssue: item.photoRequiredOnIssue,
                conditionLogic: item.conditionLogic as any,
              })),
            },
          })),
        },
      },
      include: {
        categories: {
          include: { items: true },
        },
      },
    });

    return duplicated;
  }

  async delete(id: string) {
    const template = await this.findById(id);

    // Soft delete by deactivating
    return this.prisma.checklistTemplate.update({
      where: { id },
      data: { active: false },
    });
  }

  // Get total item count for a template
  async getItemCount(templateId: string) {
    return this.prisma.checklistItem.count({
      where: {
        category: {
          templateId,
        },
      },
    });
  }
}
