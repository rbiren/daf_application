import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AcceptanceDecision } from '../../common/enums';

export class ConditionDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  relatedItemId?: string;
}

export class SubmitAcceptanceDto {
  @ApiProperty({ enum: AcceptanceDecision })
  @IsEnum(AcceptanceDecision)
  decision: AcceptanceDecision;

  @ApiPropertyOptional({ type: [ConditionDto] })
  @IsOptional()
  @IsArray()
  conditions?: ConditionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  generalNotes?: string;

  @ApiProperty({ description: 'Base64 encoded signature image' })
  @IsString()
  signatureData: string;
}
