import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';

@Injectable()
export class DealersService {
  constructor(private prisma: PrismaService) {}

  async findAll(active?: boolean) {
    return this.prisma.dealer.findMany({
      where: active !== undefined ? { active } : undefined,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            users: true,
            units: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
          },
        },
        _count: {
          select: {
            units: true,
          },
        },
      },
    });

    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    return dealer;
  }

  async findByCode(code: string) {
    return this.prisma.dealer.findUnique({
      where: { code },
    });
  }

  async create(data: CreateDealerDto) {
    const existingDealer = await this.findByCode(data.code);
    if (existingDealer) {
      throw new ConflictException('Dealer code already exists');
    }

    return this.prisma.dealer.create({
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
        phone: data.phone,
        email: data.email,
      },
    });
  }

  async update(id: string, data: UpdateDealerDto) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    if (data.code && data.code !== dealer.code) {
      const existingDealer = await this.findByCode(data.code);
      if (existingDealer) {
        throw new ConflictException('Dealer code already exists');
      }
    }

    return this.prisma.dealer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    // Soft delete by setting active to false
    return this.prisma.dealer.update({
      where: { id },
      data: { active: false },
    });
  }

  async getStats(id: string) {
    const dealer = await this.prisma.dealer.findUnique({ where: { id } });
    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    const [totalUnits, pendingAcceptance, acceptedUnits, activeUsers] = await Promise.all([
      this.prisma.unit.count({ where: { dealerId: id } }),
      this.prisma.unit.count({
        where: {
          dealerId: id,
          status: { in: ['RECEIVED', 'PDI_COMPLETE', 'IN_ACCEPTANCE'] }
        }
      }),
      this.prisma.unit.count({
        where: {
          dealerId: id,
          status: { in: ['ACCEPTED', 'CONDITIONALLY_ACCEPTED'] }
        }
      }),
      this.prisma.user.count({ where: { dealerId: id, active: true } }),
    ]);

    return {
      dealerId: id,
      totalUnits,
      pendingAcceptance,
      acceptedUnits,
      activeUsers,
    };
  }
}
