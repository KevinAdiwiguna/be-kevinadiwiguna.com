// src/projects/projects.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAllPublished() {
    return this.projectsService.getAllPublished();
  }

  @Get('list')
  getAdminAll() {
    return this.projectsService.getAdminAll();
  }

  @Get('featured')
  getFeatured() {
    return this.projectsService.getFeatured();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.projectsService.getBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id/publish')
  togglePublish(@Param('id') id: string) {
    return this.projectsService.togglePublish(BigInt(id));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectsService.delete(BigInt(id));
  }

  @Patch(':id/featured')
  toggleFeatured(@Param('id') id: string) {
    return this.projectsService.toggleFeatured(BigInt(id));
  }
}
