import { Module } from '@nestjs/common';
import { PdiService } from './pdi.service';
import { PdiController } from './pdi.controller';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [UnitsModule],
  controllers: [PdiController],
  providers: [PdiService],
  exports: [PdiService],
})
export class PdiModule {}
