import { Module } from '@nestjs/common';
import { HerosService } from './heros.service';
import { HerosController } from './heros.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HerosController],
  providers: [HerosService, PrismaService],
})
export class HerosModule {}
