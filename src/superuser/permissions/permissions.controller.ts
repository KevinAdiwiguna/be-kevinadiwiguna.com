import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { PermissionsService } from './permissions.service';

import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';

import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';
import { Permission } from 'src/commons/decorators/permission.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('permission:read')
  @RateLimit(5, 1)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }
}
