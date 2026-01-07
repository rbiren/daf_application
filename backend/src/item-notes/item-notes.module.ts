import { Module } from '@nestjs/common';
import { ItemNotesController } from './item-notes.controller';
import { ItemNotesService } from './item-notes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItemNotesController],
  providers: [ItemNotesService],
  exports: [ItemNotesService],
})
export class ItemNotesModule {}
