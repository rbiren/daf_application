import { IsString, IsOptional, IsInt, IsUUID, IsEnum, IsDateString, Length, Min, Max, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitStatus } from '../../common/enums';

export class CreateUnitDto {
  @ApiProperty({ example: '1THO123456ABC78901', description: '17-character VIN' })
  @IsString()
  @Length(17, 17, { message: 'VIN must be exactly 17 characters' })
  vin: string;

  @ApiPropertyOptional({ example: 'STK-2024-001' })
  @IsOptional()
  @IsString()
  stockNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  dealerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiProperty({ example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  modelYear: number;

  @ApiPropertyOptional({ example: 'Champagne Metallic' })
  @IsOptional()
  @IsString()
  exteriorColor?: string;

  @ApiPropertyOptional({ example: 'Saddle Leather' })
  @IsOptional()
  @IsString()
  interiorColor?: string;

  @ApiPropertyOptional({ example: 'Ford F-53' })
  @IsOptional()
  @IsString()
  chassisType?: string;

  @ApiPropertyOptional({ example: '7.3L V8' })
  @IsOptional()
  @IsString()
  engineType?: string;

  @ApiPropertyOptional({ example: 22000, description: 'Gross Vehicle Weight Rating in lbs' })
  @IsOptional()
  @IsInt()
  gvwr?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  shipDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  receiveDate?: string;

  @ApiPropertyOptional({ enum: UnitStatus })
  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;

  // NEW: Unit Profile Fields
  @ApiPropertyOptional({ example: 250000.00, description: 'MSRP in dollars' })
  @IsOptional()
  @IsNumber()
  msrp?: number;

  @ApiPropertyOptional({ description: 'Date unit was produced' })
  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @ApiPropertyOptional({ example: 'Elkhart, IN', description: 'Manufacturing plant location' })
  @IsOptional()
  @IsString()
  plantLocation?: string;

  @ApiPropertyOptional({ description: 'Special instructions or notes (JSON string)' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
