import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';

import type { Response, Request } from 'express';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RefreshTokenGuard } from 'src/commons/guards/RefreshToken.guard';
import { setAuthCookies } from 'src/commons/utils/auth-cookies.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @RateLimit(30, 1)
  @Post('signup')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @RateLimit(30, 1)
  @Post('signin')
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(data);

    setAuthCookies(response, {
      accessToken: String(result.accessToken),
      refreshToken: String(result.refreshToken),
      refreshTokenExpiresAt: String(result.refreshTokenExpiresAt),
    });

    response.status(200).json({
      message: result.message,
      user: result.user,
    });
  }

  @UseGuards(RefreshTokenGuard)
  @RateLimit(60, 1)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token found');
      } 

      const res = await this.authService.refreshAccessToken(refreshToken);
      setAuthCookies(response, {
        accessToken: res.accessToken,
        refreshToken: String(res.refreshToken),
        refreshTokenExpiresAt: String(res.refreshTokenExpiresAt),
      });

      return {
        message: 'Access token refreshed successfully',
      };
    } catch (err) {
      console.error('Refresh token error:', err.message || err);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('auth:signout_single')
  @RateLimit(5, 1)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken'];

    if (token) {
      await this.authService.revokeRefreshToken(token);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('auth:signout_all')
  @RateLimit(5, 1)
  @Post('logout-all')
  async logoutAll(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub;

    await this.authService.revokeUserRefreshTokens(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Logged out from all devices' };
  }
}
