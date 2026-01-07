import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartInspectionDto {
  @ApiProperty({ description: 'Unit ID to start inspection for' })
  @IsUUID()
  unitId: string;

  @ApiPropertyOptional({ description: 'Checklist template ID to use (if not provided, uses default for model)' })
  @IsUUID()
  @IsOptional()
  templateId?: string;
}
