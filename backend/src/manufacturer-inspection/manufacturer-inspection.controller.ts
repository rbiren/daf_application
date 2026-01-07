import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ManufacturerInspectionService } from './manufacturer-inspection.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, ManufacturerInspectionStatus } from '../common/enums';
import { StartInspectionDto } from './dto/start-inspection.dto';
import {
  UpdateInspectionItemDto,
  BulkUpdateInspectionItemsDto,
} from './dto/update-inspection-item.dto';
import {
  CompleteInspectionDto,
  ApproveInspectionDto,
  RejectInspectionDto,
} from './dto/complete-inspection.dto';

@ApiTags('manufacturer-inspection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('manufacturer-inspection')
export class ManufacturerInspectionController {
  constructor(
    private readonly inspectionService: ManufacturerInspectionService,
  ) {}

  // ============================================================================
  // INSPECTION CRUD
  // ============================================================================

  @Get()
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'List all inspections with filters' })
  @ApiQuery({ name: 'status', required: false, enum: ManufacturerInspectionStatus })
  @ApiQuery({ name: 'inspectorId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns list of inspections' })
  async findAll(
    @Query('status') status?: ManufacturerInspectionStatus,
    @Query('inspectorId') inspectorId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inspectionService.findAll({ status, inspectorId, page, limit });
  }

  @Get('pending-inspection')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get units waiting for inspection' })
  @ApiResponse({ status: 200, description: 'Returns units pending inspection' })
  async getUnitsPendingInspection() {
    return this.inspectionService.getUnitsPendingInspection();
  }

  @Get('pending-approval')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get units waiting for approval' })
  @ApiResponse({ status: 200, description: 'Returns units pending approval' })
  async getUnitsPendingApproval() {
    return this.inspectionService.getUnitsPendingApproval();
  }

  @Get('ready-to-ship')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get units approved and ready to ship' })
  @ApiResponse({ status: 200, description: 'Returns units ready to ship' })
  async getUnitsReadyToShip() {
    return this.inspectionService.getUnitsReadyToShip();
  }

  @Get(':id')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get inspection by ID' })
  @ApiResponse({ status: 200, description: 'Returns inspection details' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  async getInspection(@Param('id') id: string) {
    return this.inspectionService.getInspectionById(id);
  }

  @Get('unit/:unitId')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get inspection by unit ID' })
  @ApiResponse({ status: 200, description: 'Returns inspection for unit' })
  @ApiResponse({ status: 404, description: 'No inspection found' })
  async getInspectionByUnit(@Param('unitId') unitId: string) {
    return this.inspectionService.getInspectionByUnitId(unitId);
  }

  // ============================================================================
  // INSPECTION WORKFLOW
  // ============================================================================

  @Post('start')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Start a new inspection for a unit' })
  @ApiResponse({ status: 201, description: 'Inspection started' })
  @ApiResponse({ status: 400, description: 'Invalid unit status or inspection already exists' })
  async startInspection(
    @Body() dto: StartInspectionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.startInspection(dto, userId);
  }

  @Patch(':id/items/:itemId')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Update a single inspection item' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async updateItem(
    @Param('id') inspectionId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateInspectionItemDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.updateInspectionItem(
      inspectionId,
      itemId,
      dto,
      userId,
    );
  }

  @Patch(':id/items')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Bulk update inspection items' })
  @ApiResponse({ status: 200, description: 'Items updated' })
  async bulkUpdateItems(
    @Param('id') inspectionId: string,
    @Body() dto: BulkUpdateInspectionItemsDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.bulkUpdateItems(inspectionId, dto, userId);
  }

  @Post(':id/complete')
  @Roles(UserRole.MFG_QA, UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Complete the inspection (submit for approval)' })
  @ApiResponse({ status: 200, description: 'Inspection completed' })
  @ApiResponse({ status: 400, description: 'Not all required items completed' })
  async completeInspection(
    @Param('id') inspectionId: string,
    @Body() dto: CompleteInspectionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.completeInspection(inspectionId, dto, userId);
  }

  @Post(':id/approve')
  @Roles(UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Approve the inspection (unit ready to ship)' })
  @ApiResponse({ status: 200, description: 'Inspection approved' })
  @ApiResponse({ status: 400, description: 'Inspection not completed' })
  async approveInspection(
    @Param('id') inspectionId: string,
    @Body() dto: ApproveInspectionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.approveInspection(inspectionId, dto, userId);
  }

  @Post(':id/reject')
  @Roles(UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Reject the inspection (needs rework)' })
  @ApiResponse({ status: 200, description: 'Inspection rejected' })
  @ApiResponse({ status: 400, description: 'Inspection not completed' })
  async rejectInspection(
    @Param('id') inspectionId: string,
    @Body() dto: RejectInspectionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.rejectInspection(inspectionId, dto, userId);
  }

  // ============================================================================
  // SHIPPING
  // ============================================================================

  @Post('ship/:unitId')
  @Roles(UserRole.MFG_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Ship unit to dealer (makes it visible to dealer)' })
  @ApiResponse({ status: 200, description: 'Unit shipped' })
  @ApiResponse({ status: 400, description: 'Unit not approved' })
  async shipUnit(
    @Param('unitId') unitId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.inspectionService.shipUnit(unitId, userId);
  }
}
