import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';

import { FilesService } from './files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateLimitService } from 'src/rate-limit/rate-limit.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, RateLimitService],
})
export class FilesModule {}
