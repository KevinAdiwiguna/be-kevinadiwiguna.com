import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { SkillsService } from './skills.service';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

import { Permission } from 'src/commons/decorators/permission.decorator';

import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('skill:create')
  @RateLimit(30, 1)
  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.skillsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('skill:update')
  @Patch(':id')
  update(@Param('id') id: bigint, @Body() dto: UpdateSkillDto) {
    return this.skillsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('skill:delete')
  @Delete(':id')
  remove(@Param('id') id: bigint) {
    return this.skillsService.remove(id);
  }
}
