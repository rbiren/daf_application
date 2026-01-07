import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { CreateChecklistTemplateDto } from './dto/create-checklist-template.dto';
import { UpdateChecklistTemplateDto } from './dto/update-checklist-template.dto';

@ApiTags('checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  @ApiOperation({ summary: 'List all checklist templates' })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns list of templates' })
  async findAll(@Query('active') active?: boolean) {
    return this.checklistService.findAll(active);
  }

  @Get('for-model/:modelId')
  @ApiOperation({ summary: 'Get checklist template for a specific model' })
  @ApiResponse({ status: 200, description: 'Returns template' })
  async findForModel(@Param('modelId') modelId: string) {
    return this.checklistService.findForModel(modelId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get checklist template by ID' })
  @ApiResponse({ status: 200, description: 'Returns template' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findById(@Param('id') id: string) {
    return this.checklistService.findById(id);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Create new checklist template' })
  @ApiResponse({ status: 201, description: 'Template created' })
  async create(
    @Body() createDto: CreateChecklistTemplateDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.checklistService.create(createDto, userId);
  }

  @Put(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Update checklist template' })
  @ApiResponse({ status: 200, description: 'Template updated' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateChecklistTemplateDto) {
    return this.checklistService.update(id, updateDto);
  }

  @Post(':id/duplicate')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Duplicate a checklist template' })
  @ApiResponse({ status: 201, description: 'Template duplicated' })
  async duplicate(
    @Param('id') id: string,
    @Body('name') name: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.checklistService.duplicate(id, name, userId);
  }

  @Post(':id/categories')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Add category to template' })
  @ApiResponse({ status: 201, description: 'Category added' })
  async addCategory(@Param('id') templateId: string, @Body() data: any) {
    return this.checklistService.addCategory(templateId, data);
  }

  @Post('categories/:categoryId/items')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Add item to category' })
  @ApiResponse({ status: 201, description: 'Item added' })
  async addItem(@Param('categoryId') categoryId: string, @Body() data: any) {
    return this.checklistService.addItem(categoryId, data);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN)
  @ApiOperation({ summary: 'Deactivate checklist template' })
  @ApiResponse({ status: 200, description: 'Template deactivated' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async delete(@Param('id') id: string) {
    return this.checklistService.delete(id);
  }
}
