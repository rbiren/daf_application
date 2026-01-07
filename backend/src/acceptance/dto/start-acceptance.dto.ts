import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartAcceptanceDto {
  @ApiProperty({ example: '1THO123456ABC78901', description: 'VIN of the unit to accept' })
  @IsString()
  @Length(17, 17)
  vin: string;

  @ApiPropertyOptional({ description: 'Device information JSON' })
  @IsOptional()
  deviceInfo?: any;

  @ApiPropertyOptional({ description: 'Location data JSON' })
  @IsOptional()
  locationData?: any;
}
