import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ResendService } from 'src/resend/resend.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';

@Module({
  imports: [AuthModule, RateLimitModule],
  providers: [OtpService, ResendService, PrismaService, JwtStrategy],
  controllers: [OtpController]
})
export class OtpModule {}
