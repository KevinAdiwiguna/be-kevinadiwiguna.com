import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitService } from '../../rate-limit/rate-limit.service';
import { Request } from 'express';
import { JwtPayload } from 'src/commons/types/jwt.types';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private rateLimitService: RateLimitService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const rateLimit = this.reflector.get<{ limit: number; minutes: number }>(
      "rate_limit",
      context.getHandler(),
    );


    if (!rateLimit) return true; 

    const user = req.user as JwtPayload;
    const { limit, minutes } = rateLimit;
    const userId = user?.sub ? BigInt(user.sub) : null;
    const ip = req.ip as string;
    const action = req.route.path;
    const windowMs = minutes * 60 * 1000;


    try {
      if (userId) {
        await this.rateLimitService.limitUser(userId, action, limit, windowMs);
      } else {
        await this.rateLimitService.limitIp(ip, action, limit, windowMs);
      }
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Rate limit error', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
