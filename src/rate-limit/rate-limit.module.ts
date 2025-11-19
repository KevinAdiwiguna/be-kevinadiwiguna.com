import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [RateLimitService, PrismaService],
  exports: [RateLimitService],
})
export class RateLimitModule {}
