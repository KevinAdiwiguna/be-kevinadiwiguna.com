import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ResendService } from 'src/resend/resend.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';

@Module({
  imports: [AuthModule, RateLimitModule],
  providers: [OtpService, ResendService, PrismaService],
  controllers: [OtpController]
})
export class OtpModule {}
