import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../common/enums';

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  dealerId?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  role?: UserRole;
  dealerId?: string;
  active?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(dealerId?: string) {
    return this.prisma.user.findMany({
      where: dealerId ? { dealerId } : undefined,
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async create(data: CreateUserData) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role,
        dealerId: data.dealerId,
      },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateUserData) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by setting active to false
    return this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}
