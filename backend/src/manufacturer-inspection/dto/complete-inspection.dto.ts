import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteInspectionDto {
  @ApiPropertyOptional({ description: 'General notes for the inspection' })
  @IsString()
  @IsOptional()
  generalNotes?: string;

  @ApiPropertyOptional({ description: 'Digital signature data (base64)' })
  @IsString()
  @IsOptional()
  signatureData?: string;
}

export class ApproveInspectionDto {
  @ApiPropertyOptional({ description: 'Notes for approval' })
  @IsString()
  @IsOptional()
  approvalNotes?: string;
}

export class RejectInspectionDto {
  @ApiPropertyOptional({ description: 'Reason for rejection' })
  @IsString()
  rejectionReason: string;
}
