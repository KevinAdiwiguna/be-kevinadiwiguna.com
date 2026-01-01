import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from '../permissions/dto/update-permission.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.prisma.roles.create({
      data: {
        name: createRoleDto.name,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    return role;
  }

  async findAll() {
    return this.prisma.roles.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.roles.findUnique({
      where: { id: BigInt(id) },
      include: {
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                label: true,
              },
            },
          },
        },
      },
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async updatePermissions(roleId: bigint, dto: UpdateRolePermissionsDto) {
    const role = await this.prisma.roles.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const validPermissions = await this.prisma.permissions.findMany({
      where: {
        id: { in: dto.permissionIds.map(BigInt) },
      },
      select: { id: true },
    });

    if (validPermissions.length !== dto.permissionIds.length) {
      throw new BadRequestException('Invalid permission id detected');
    }

    await this.prisma.$transaction([
      this.prisma.roles_permissions.deleteMany({
        where: { roleId },
      }),
      this.prisma.roles_permissions.createMany({
        data: dto.permissionIds.map((pid) => ({
          roleId,
          permissionId: BigInt(pid),
        })),
      }),
    ]);

    return { success: true };
  }

  async remove(id: number) {
    await this.prisma.roles.delete({
      where: { id: BigInt(id) },
    });
    return { message: `Role with id ${id} has been deleted` };
  }
}
