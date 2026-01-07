import { IsString, IsOptional, IsInt, IsUUID, IsEnum, IsDateString, Length, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';

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
}
