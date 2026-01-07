import { IsString, IsOptional, IsArray, ValidateNested, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChecklistItemDto {
  @ApiProperty({ example: '1.2.3' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Check entry steps operation' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'Open door and verify steps extend...' })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  photoRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  photoRequiredOnIssue?: boolean;

  @ApiPropertyOptional({ description: 'JSON object for conditional display logic' })
  @IsOptional()
  conditionLogic?: any;
}

export class CreateChecklistCategoryDto {
  @ApiProperty({ example: 'Exterior Inspection' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'EXT' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ type: [CreateChecklistItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  items?: CreateChecklistItemDto[];
}

export class CreateChecklistTemplateDto {
  @ApiProperty({ example: 'Standard RV Acceptance Checklist' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of model UUIDs this template applies to' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  modelIds?: string[];

  @ApiPropertyOptional({ type: [CreateChecklistCategoryDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistCategoryDto)
  categories?: CreateChecklistCategoryDto[];
}
