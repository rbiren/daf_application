import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PdiService } from './pdi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import { CreatePdiDto } from './dto/create-pdi.dto';
import { UpdatePdiItemDto } from './dto/update-pdi-item.dto';

@ApiTags('pdi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pdi')
export class PdiController {
  constructor(private readonly pdiService: PdiService) {}

  @Get('unit/:vin')
  @ApiOperation({ summary: 'Get PDI records for a unit by VIN' })
  @ApiResponse({ status: 200, description: 'Returns PDI records' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async findByUnitVin(@Param('vin') vin: string) {
    return this.pdiService.findByUnitVin(vin);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get PDI record by ID' })
  @ApiResponse({ status: 200, description: 'Returns PDI record' })
  @ApiResponse({ status: 404, description: 'PDI record not found' })
  async findById(@Param('id') id: string) {
    return this.pdiService.findById(id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get PDI summary' })
  @ApiResponse({ status: 200, description: 'Returns PDI summary' })
  async getSummary(@Param('id') id: string) {
    return this.pdiService.getSummary(id);
  }

  @Post('unit/:vin')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Create PDI record for a unit (webhook endpoint)' })
  @ApiResponse({ status: 201, description: 'PDI record created' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async create(@Param('vin') vin: string, @Body() createPdiDto: CreatePdiDto) {
    return this.pdiService.create(vin, createPdiDto);
  }

  // Webhook endpoint - can be called without auth (should be secured via API key in production)
  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'PDI webhook receiver (for external integrations)' })
  @ApiResponse({ status: 201, description: 'PDI data received' })
  async receiveWebhook(@Body() body: { vin: string } & CreatePdiDto) {
    const { vin, ...pdiData } = body;
    return this.pdiService.create(vin, pdiData);
  }

  @Patch('items/:itemId')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'Update PDI item (e.g., mark as resolved)' })
  @ApiResponse({ status: 200, description: 'PDI item updated' })
  @ApiResponse({ status: 404, description: 'PDI item not found' })
  async updateItem(@Param('itemId') itemId: string, @Body() updatePdiItemDto: UpdatePdiItemDto) {
    return this.pdiService.updateItem(itemId, updatePdiItemDto);
  }
}
