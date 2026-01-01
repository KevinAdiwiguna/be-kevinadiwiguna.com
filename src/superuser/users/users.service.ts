import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyUser(id: number) {
    await this.ensureUserExists(id);

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { emailVerified: new Date() },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          updatedAt: true,
        },
      });
      return { message: 'User verified successfully' };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          isDisabled: true,
          emailVerified: true,
          roleId: true,
          role: { select: { name: true } },
          createdAt: true,
        },
      }),
      this.prisma.users.count(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(id: number, roleId: number) {
    await this.ensureUserExists(id);

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { roleId },
        include: {
          role: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`Failed to update role for user ${id}`);
    }
  }

  async remove(id: number) {
    await this.ensureUserExists(id);

    await this.prisma.users.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully',
    };
  }

  private async ensureUserExists(id: number) {
    const exists = await this.prisma.users.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('User not found');
    }
  }
}
