// src/projects/projects.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAllPublished() {
    return this.projectsService.getAllPublished();
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Get('list')
  @Permission('project:read_own')
  @RateLimit(10, 1)
  getAdminAll() {
    return this.projectsService.getAdminAll();
  }
  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('project:read_featured')
  @RateLimit(10, 1)
  @Get('featured')
  getFeatured() {
    return this.projectsService.getFeatured();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.projectsService.getBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('project:create')
  @RateLimit(5, 1)
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('project:publish')
  @RateLimit(10, 1)
  @Patch(':id/publish')
  togglePublish(@Param('id') id: string) {
    return this.projectsService.togglePublish(BigInt(id));
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('project:delete')
  @RateLimit(10, 1)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectsService.delete(BigInt(id));
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('project:update_featured')
  @RateLimit(10, 1)
  @Patch(':id/featured')
  toggleFeatured(@Param('id') id: string) {
    return this.projectsService.toggleFeatured(BigInt(id));
  }
}
