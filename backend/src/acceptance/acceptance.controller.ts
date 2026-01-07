import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AcceptanceService } from './acceptance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, AcceptanceStatus } from '../common/enums';
import { StartAcceptanceDto } from './dto/start-acceptance.dto';
import { UpdateAcceptanceItemDto } from './dto/update-acceptance-item.dto';
import { SubmitAcceptanceDto } from './dto/submit-acceptance.dto';
import { Request } from 'express';

@ApiTags('acceptance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('acceptances')
export class AcceptanceController {
  constructor(private readonly acceptanceService: AcceptanceService) {}

  @Get()
  @ApiOperation({ summary: 'List acceptance records' })
  @ApiQuery({ name: 'dealerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: AcceptanceStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns list of acceptance records' })
  async findAll(
    @Query('dealerId') dealerId?: string,
    @Query('status') status?: AcceptanceStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: any,
  ) {
    const effectiveDealerId =
      user?.role === UserRole.DEALER_TECH || user?.role === UserRole.DEALER_ADMIN
        ? user.dealerId
        : dealerId;

    return this.acceptanceService.findAll({
      dealerId: effectiveDealerId,
      status,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get acceptance record by ID' })
  @ApiResponse({ status: 200, description: 'Returns acceptance record' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findById(@Param('id') id: string) {
    return this.acceptanceService.findById(id);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get acceptance progress' })
  @ApiResponse({ status: 200, description: 'Returns progress info' })
  async getProgress(@Param('id') id: string) {
    return this.acceptanceService.getProgress(id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get acceptance summary' })
  @ApiResponse({ status: 200, description: 'Returns summary' })
  async getSummary(@Param('id') id: string) {
    return this.acceptanceService.getSummary(id);
  }

  @Get('unit/:vin')
  @ApiOperation({ summary: 'Get acceptance records for a unit' })
  @ApiResponse({ status: 200, description: 'Returns acceptance records' })
  async findByVin(@Param('vin') vin: string) {
    return this.acceptanceService.findByVin(vin);
  }

  @Post()
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Start new acceptance (or resume existing)' })
  @ApiResponse({ status: 201, description: 'Acceptance started' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async start(
    @Body() startDto: StartAcceptanceDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('dealerId') dealerId: string,
  ) {
    return this.acceptanceService.start(startDto, userId, dealerId);
  }

  @Patch(':id/items/:itemId')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Update acceptance item status' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async updateItem(
    @Param('id') acceptanceId: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateAcceptanceItemDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.acceptanceService.updateItem(acceptanceId, itemId, updateDto, userId);
  }

  @Patch(':id/items')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Bulk update acceptance items' })
  @ApiResponse({ status: 200, description: 'Items updated' })
  async updateItems(
    @Param('id') acceptanceId: string,
    @Body() items: { id: string; status: string; notes?: string }[],
  ) {
    return this.acceptanceService.updateItems(acceptanceId, items as any);
  }

  @Post(':id/submit')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Submit completed acceptance' })
  @ApiResponse({ status: 200, description: 'Acceptance submitted' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async submit(
    @Param('id') id: string,
    @Body() submitDto: SubmitAcceptanceDto,
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.acceptanceService.submit(id, submitDto, userId, ipAddress);
  }

  @Post(':id/cancel')
  @Roles(UserRole.DEALER_TECH, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Cancel in-progress acceptance' })
  @ApiResponse({ status: 200, description: 'Acceptance cancelled' })
  async cancel(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.acceptanceService.cancel(id, userId);
  }
}
