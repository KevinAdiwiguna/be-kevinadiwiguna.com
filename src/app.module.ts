import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { ResendService } from './resend/resend.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OtpModule } from './otp/otp.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { HerosModule } from './heros/heros.module';
import { ResendModule } from './resend/resend.module';

import { AppController } from './app.controller';
import { RateLimitController } from './rate-limit/rate-limit.controller';

import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { ExperienceModule } from './experience/experience.module';
import { SkillsModule } from './skills/skills.module';
import { TechModule } from './tech/tech.module';

@Module({
  imports: [AuthModule,  PrismaModule, ResendModule,
     ConfigModule.forRoot({ 
      isGlobal: true, 
    }),
     OtpModule,
     RateLimitModule,
     HerosModule,
     ExperienceModule,
     SkillsModule,
     TechModule,
  ],
  controllers: [AppController, RateLimitController],
  providers: [AppService, PrismaService, AuthService, ResendService, RefreshTokenService, RateLimitGuard],
  exports: [RateLimitGuard]
})
export class AppModule {}
