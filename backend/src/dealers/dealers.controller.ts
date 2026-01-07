import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DealersService } from './dealers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';

@ApiTags('dealers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA)
  @ApiOperation({ summary: 'List all dealers' })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns list of dealers' })
  async findAll(@Query('active') active?: boolean) {
    return this.dealersService.findAll(active);
  }

  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Get dealer by ID' })
  @ApiResponse({ status: 200, description: 'Returns dealer' })
  @ApiResponse({ status: 404, description: 'Dealer not found' })
  async findOne(@Param('id') id: string) {
    return this.dealersService.findById(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN, UserRole.MFG_QA, UserRole.DEALER_ADMIN)
  @ApiOperation({ summary: 'Get dealer statistics' })
  @ApiResponse({ status: 200, description: 'Returns dealer stats' })
  @ApiResponse({ status: 404, description: 'Dealer not found' })
  async getStats(@Param('id') id: string) {
    return this.dealersService.getStats(id);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN)
  @ApiOperation({ summary: 'Create new dealer' })
  @ApiResponse({ status: 201, description: 'Dealer created' })
  @ApiResponse({ status: 409, description: 'Dealer code already exists' })
  async create(@Body() createDealerDto: CreateDealerDto) {
    return this.dealersService.create(createDealerDto);
  }

  @Put(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN)
  @ApiOperation({ summary: 'Update dealer' })
  @ApiResponse({ status: 200, description: 'Dealer updated' })
  @ApiResponse({ status: 404, description: 'Dealer not found' })
  async update(@Param('id') id: string, @Body() updateDealerDto: UpdateDealerDto) {
    return this.dealersService.update(id, updateDealerDto);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.MFG_ADMIN)
  @ApiOperation({ summary: 'Deactivate dealer' })
  @ApiResponse({ status: 200, description: 'Dealer deactivated' })
  @ApiResponse({ status: 404, description: 'Dealer not found' })
  async remove(@Param('id') id: string) {
    return this.dealersService.delete(id);
  }
}
