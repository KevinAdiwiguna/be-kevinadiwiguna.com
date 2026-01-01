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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('users:read')
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.usersService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('users:verify')
  @Patch(':id/verify')
  async verifyUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.verifyUser(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('users:read_id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('users:update_role')
  @Patch(':id/role/:roleId')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.usersService.updateUserRole(id, roleId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('user:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
