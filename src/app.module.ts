import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';


import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResendService } from './resend/resend.service';
import { ResendModule } from './resend/resend.module';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { OtpModule } from './otp/otp.module';
import { RateLimitController } from './rate-limit/rate-limit.controller';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { HerosModule } from './heros/heros.module';

@Module({
  imports: [AuthModule,  PrismaModule, ResendModule,
     ConfigModule.forRoot({ 
      isGlobal: true, 
    }),
     OtpModule,
     RateLimitModule,
     HerosModule,
  ],
  controllers: [AppController, RateLimitController],
  providers: [AppService, PrismaService, AuthService, ResendService, RefreshTokenService],
})
export class AppModule {}
