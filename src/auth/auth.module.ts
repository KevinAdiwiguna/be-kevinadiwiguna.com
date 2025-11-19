import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { ResendModule } from 'src/resend/resend.module';
import { ResendService } from 'src/resend/resend.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    ResendModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResendService, RefreshTokenService, JwtStrategy ],
})

export class AuthModule { }
