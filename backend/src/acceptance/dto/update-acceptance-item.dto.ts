import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemStatus, IssueSeverity } from '../../common/enums';

export class UpdateAcceptanceItemDto {
  @ApiProperty({ enum: ItemStatus })
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: IssueSeverity })
  @IsOptional()
  @IsEnum(IssueSeverity)
  issueSeverity?: IssueSeverity;
}
