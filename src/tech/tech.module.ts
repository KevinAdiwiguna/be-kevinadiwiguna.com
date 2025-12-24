import { Module } from '@nestjs/common';
import { TechService } from './tech.service';
import { TechController } from './tech.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TechController],
  providers: [TechService, PrismaService],
})
export class TechModule {}
