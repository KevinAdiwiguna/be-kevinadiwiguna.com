import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAccessStrategy } from 'src/commons/strategy/jwt-access.strategy';
import { JwtAuthStrategy } from 'src/commons/strategy/jwt-auth.strategy';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, JwtAuthStrategy, JwtAccessStrategy],
})
export class PermissionsModule {}
