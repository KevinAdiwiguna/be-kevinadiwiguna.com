import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenService } from "../../refresh-token/refresh-token.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokenRecord =
      await this.refreshTokenService.validateToken(refreshToken);

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    req['user'] = tokenRecord.user;
    req['refreshToken'] = tokenRecord;

    return true;
  }
}
