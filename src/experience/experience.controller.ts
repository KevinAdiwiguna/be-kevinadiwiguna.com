import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly service: ExperienceService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('create_experience')
  @RateLimit(5, 1)
  @Post()
  async create(@Body() dto: CreateExperienceDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('read_experience_id')
  @RateLimit(50, 1)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('update_experience')
  @RateLimit(5, 1)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('delete_experience')
  @RateLimit(5, 1)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: bigint) {
    return this.service.remove(id);
  }
}
