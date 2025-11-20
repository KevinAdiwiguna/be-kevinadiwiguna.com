import { Module } from '@nestjs/common';
import { HerosService } from './heros.service';
import { HerosController } from './heros.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';

@Module({
  imports: [RateLimitModule],
  controllers: [HerosController],
  providers: [HerosService, PrismaService],
})
export class HerosModule {}
