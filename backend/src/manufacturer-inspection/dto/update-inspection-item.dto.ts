import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemStatus, IssueSeverityLevel } from '../../common/enums';

export class UpdateInspectionItemDto {
  @ApiProperty({ description: 'Item status', enum: ItemStatus })
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @ApiPropertyOptional({ description: 'Notes for this item' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Whether this item has an issue' })
  @IsBoolean()
  @IsOptional()
  isIssue?: boolean;

  @ApiPropertyOptional({ description: 'Severity of the issue', enum: IssueSeverityLevel })
  @IsEnum(IssueSeverityLevel)
  @IsOptional()
  issueSeverity?: IssueSeverityLevel;
}

export class BulkUpdateInspectionItemsDto {
  @ApiProperty({ type: [Object], description: 'Array of items to update' })
  items: {
    itemId: string;
    status: ItemStatus;
    notes?: string;
    isIssue?: boolean;
    issueSeverity?: IssueSeverityLevel;
  }[];
}
