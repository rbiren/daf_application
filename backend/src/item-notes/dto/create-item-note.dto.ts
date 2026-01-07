import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemNoteDto {
  @ApiPropertyOptional({ description: 'Manufacturer inspection item ID (if note is on manufacturer item)' })
  @IsUUID()
  @IsOptional()
  manufacturerItemId?: string;

  @ApiPropertyOptional({ description: 'Acceptance item ID (if note is on dealer item)' })
  @IsUUID()
  @IsOptional()
  acceptanceItemId?: string;

  @ApiProperty({ description: 'Note content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Make visible to dealer (manufacturer only)', default: false })
  @IsBoolean()
  @IsOptional()
  visibleToDealer?: boolean;

  @ApiPropertyOptional({ description: 'Make visible to manufacturer (dealer only)', default: true })
  @IsBoolean()
  @IsOptional()
  visibleToManufacturer?: boolean;
}

export class UpdateItemNoteDto {
  @ApiPropertyOptional({ description: 'Updated note content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Update visibility to dealer' })
  @IsBoolean()
  @IsOptional()
  visibleToDealer?: boolean;

  @ApiPropertyOptional({ description: 'Update visibility to manufacturer' })
  @IsBoolean()
  @IsOptional()
  visibleToManufacturer?: boolean;
}

export class SubmitNoteDto {
  @ApiPropertyOptional({ description: 'Make visible to dealer when submitting' })
  @IsBoolean()
  @IsOptional()
  makeVisibleToDealer?: boolean;
}
