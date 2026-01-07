import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({ enum: UnitStatus })
  @IsEnum(UnitStatus)
  status: UnitStatus;
}
