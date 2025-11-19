import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { OtpService } from './otp.service';

import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('otp')
export class OtpController {
    constructor(private readonly otp: OtpService) { }

    @UseGuards(JwtAuthGuard)
    @Post('request-verification')
    async requestVerification(@Req() req) {
        const email = req.user.email;
        return this.otp.requestEmailVerification(email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify-email')
    async verify(@Req() req, @Body() dto: VerifyEmailDto) {
        const email = req.user.email;
        return this.otp.verifyEmail(email, dto);
    }

}
