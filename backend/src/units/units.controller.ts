import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, UnitStatus } from '@prisma/client';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'List units with optional filters' })
  @ApiQuery({ name: 'dealerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: UnitStatus })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns list of units' })
  async findAll(
    @Query('dealerId') dealerId?: string,
    @Query('status') status?: UnitStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: any,
  ) {
    // If user is a dealer employee, restrict to their dealer
    const effectiveDealerId =
      user?.role === UserRole.DEALER_TECH || user?.role === UserRole.DEALER_ADMIN
        ? user.dealerId
        : dealerId;

    return this.unitsService.findAll({
      dealerId: effectiveDealerId,
      status,
      search,
      page,
      limit,
    });
  }

  @Get('pending')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Get units pending acceptance for current dealer' })
  @ApiResponse({ status: 200, description: 'Returns pending units' })
  async getPendingUnits(@CurrentUser('dealerId') dealerId: string) {
    return this.unitsService.getPendingUnits(dealerId);
  }

  @Get('in-progress')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Get units with in-progress acceptance for current dealer' })
  @ApiResponse({ status: 200, description: 'Returns in-progress units' })
  async getInProgressUnits(@CurrentUser('dealerId') dealerId: string) {
    return this.unitsService.getInProgressUnits(dealerId);
  }

  @Get(':vin')
  @ApiOperation({ summary: 'Get unit by VIN' })
  @ApiResponse({ status: 200, description: 'Returns unit details' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async findByVin(@Param('vin') vin: string) {
    return this.unitsService.findByVin(vin);
  }

  @Get(':vin/history')
  @ApiOperation({ summary: 'Get unit event history' })
  @ApiResponse({ status: 200, description: 'Returns unit history' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async getHistory(@Param('vin') vin: string) {
    return this.unitsService.getHistory(vin);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN)
  @ApiOperation({ summary: 'Create new unit' })
  @ApiResponse({ status: 201, description: 'Unit created' })
  @ApiResponse({ status: 400, description: 'Invalid VIN or unit already exists' })
  async create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Put(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN)
  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, description: 'Unit updated' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Update unit status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.unitsService.updateStatus(id, updateStatusDto.status, userId);
  }

  @Post(':id/receive')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Mark unit as received at dealership' })
  @ApiResponse({ status: 200, description: 'Unit marked as received' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async markReceived(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.unitsService.markReceived(id, userId);
  }
}
