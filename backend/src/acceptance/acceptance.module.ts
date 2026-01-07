import { Module } from '@nestjs/common';
import { AcceptanceService } from './acceptance.service';
import { AcceptanceController } from './acceptance.controller';
import { UnitsModule } from '../units/units.module';
import { ChecklistModule } from '../checklist/checklist.module';

@Module({
  imports: [UnitsModule, ChecklistModule],
  controllers: [AcceptanceController],
  providers: [AcceptanceService],
  exports: [AcceptanceService],
})
export class AcceptanceModule {}
