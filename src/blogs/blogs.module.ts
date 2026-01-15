import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';

@Module({
  imports: [RateLimitModule],
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService],
})
export class BlogsModule {}
