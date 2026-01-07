import { Module } from '@nestjs/common';
import { ManufacturerInspectionController } from './manufacturer-inspection.controller';
import { ManufacturerInspectionService } from './manufacturer-inspection.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ManufacturerInspectionController],
  providers: [ManufacturerInspectionService],
  exports: [ManufacturerInspectionService],
})
export class ManufacturerInspectionModule {}
