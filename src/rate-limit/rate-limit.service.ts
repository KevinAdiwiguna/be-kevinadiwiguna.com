import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RateLimitService {
  constructor(private prisma: PrismaService) {}

  async limitUser(userId: bigint, action: string, limit: number, windowMs: number) {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowMs);

    let record = await this.prisma.rate_limits.findFirst({ where: { userId, action } });

    if (!record) {
      await this.prisma.rate_limits.create({
        data: { userId, action, count: 1, expiresAt: windowEnd },
      });
      return;
    }

    if (record.expiresAt < now) {
      await this.prisma.rate_limits.update({
        where: { id: record.id },
        data: { count: 1, expiresAt: windowEnd },
      });
      return;
    }

    if (record.count >= limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.prisma.rate_limits.update({
      where: { id: record.id },
      data: { count: record.count + 1 },
    });
  }

  async limitIp(ip: string, action: string, limit: number, windowMs: number) {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowMs);

    let record = await this.prisma.rate_limits.findFirst({ where: { ip, action } });

    if (!record) {
      await this.prisma.rate_limits.create({
        data: { ip, action, count: 1, expiresAt: windowEnd },
      });
      return;
    }

    if (record.expiresAt < now) {
      await this.prisma.rate_limits.update({
        where: { id: record.id },
        data: { count: 1, expiresAt: windowEnd },
      });
      return;
    }

    if (record.count >= limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.prisma.rate_limits.update({
      where: { id: record.id },
      data: { count: record.count + 1 },
    });
  }
}
 