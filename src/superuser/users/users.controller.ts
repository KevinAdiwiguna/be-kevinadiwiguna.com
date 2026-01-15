import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('users:read')
  @RateLimit(10, 1)
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.usersService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('users:verify')
  @RateLimit(10, 1)
  @Patch(':id/verify')
  async verifyUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.verifyUser(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('users:read_id')
  @RateLimit(10, 1)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('users:update_role')
  @RateLimit(10, 1)
  @Patch(':id/role/:roleId')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.usersService.updateUserRole(id, roleId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('users:delete')
  @RateLimit(10, 1)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
