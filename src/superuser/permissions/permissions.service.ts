import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.permissions.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
