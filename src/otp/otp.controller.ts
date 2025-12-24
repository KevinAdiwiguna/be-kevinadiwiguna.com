import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { OtpService } from './otp.service';

import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

@Controller('otp')
export class OtpController {
    constructor(private readonly otp: OtpService) { }

    @UseGuards(JwtAuthGuard, RateLimitGuard)
    @RateLimit(5, 1)
    @Post('request-verification')
    async requestVerification(@Req() req) {
        const email = req.user.email;
        return this.otp.requestEmailVerification(email);
    }

    @UseGuards(JwtAuthGuard, RateLimitGuard)
    @RateLimit(5, 1)
    @Post('verify-email')
    async verify(@Req() req, @Body() dto: VerifyEmailDto) {
        const email = req.user.email;
        return this.otp.verifyEmail(email, dto);
    }

}
