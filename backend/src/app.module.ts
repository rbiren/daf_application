import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DealersModule } from './dealers/dealers.module';
import { UnitsModule } from './units/units.module';
import { PdiModule } from './pdi/pdi.module';
import { AcceptanceModule } from './acceptance/acceptance.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ManufacturerInspectionModule } from './manufacturer-inspection/manufacturer-inspection.module';
import { ItemNotesModule } from './item-notes/item-notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DealersModule,
    UnitsModule,
    PdiModule,
    AcceptanceModule,
    ChecklistModule,
    ManufacturerInspectionModule,
    ItemNotesModule,
  ],
})
export class AppModule {}
