import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemStatus } from '../../common/enums';

export class CreatePdiItemDto {
  @ApiPropertyOptional({ example: '1.2.3' })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({ example: 'Entry steps operation' })
  @IsOptional()
  @IsString()
  itemDescription?: string;

  @ApiProperty({ enum: ItemStatus })
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  resolved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolvedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  resolvedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class CreatePdiDto {
  @ApiPropertyOptional({ example: 'INS-001' })
  @IsOptional()
  @IsString()
  inspectorId?: string;

  @ApiPropertyOptional({ example: 'John Inspector' })
  @IsOptional()
  @IsString()
  inspectorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [CreatePdiItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePdiItemDto)
  items?: CreatePdiItemDto[];
}
