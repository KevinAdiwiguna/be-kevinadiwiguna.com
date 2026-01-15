import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { response } from 'express';
import { UpdateRolePermissionsDto } from '../permissions/dto/update-permission.dto';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('roles:create')
  @RateLimit(5, 1)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('roles:read')
  @RateLimit(10, 1)
  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('roles:read_id')
  @RateLimit(10, 1)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('roles:update_permissions')
  @RateLimit(5, 1)
  @Patch(':id/permissions')
  updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updatePermissions(BigInt(id), dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('roles:delete')
  @RateLimit(5, 1)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.remove(id);
  }
}
