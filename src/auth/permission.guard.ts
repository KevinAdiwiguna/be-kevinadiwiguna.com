import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) return true; 

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const role = await this.prisma.roles.findUnique({
      where: { id: user.roleId },
      include: { permissions: { include: { permission: true } } },
    });

    const hasPermission = role?.permissions.some(p => p.permission.name === requiredPermission);

    if (!hasPermission) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
