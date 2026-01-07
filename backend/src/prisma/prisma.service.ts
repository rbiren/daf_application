import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Delete in correct order to respect foreign key constraints
    await this.$transaction([
      this.acceptancePhoto.deleteMany(),
      this.acceptanceItem.deleteMany(),
      this.acceptanceRecord.deleteMany(),
      this.pdiPhoto.deleteMany(),
      this.pdiItem.deleteMany(),
      this.pdiRecord.deleteMany(),
      this.unitEvent.deleteMany(),
      this.unitOption.deleteMany(),
      this.unit.deleteMany(),
      this.checklistItem.deleteMany(),
      this.checklistCategory.deleteMany(),
      this.checklistTemplate.deleteMany(),
      this.auditLog.deleteMany(),
      this.syncQueue.deleteMany(),
      this.user.deleteMany(),
      this.dealer.deleteMany(),
      this.option.deleteMany(),
      this.model.deleteMany(),
    ]);
  }
}
