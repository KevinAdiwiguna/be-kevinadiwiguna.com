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
import { TechService } from './tech.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';
import { Permission } from 'src/commons/decorators/permission.decorator';

@Controller('tech')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('tech:create')
  @RateLimit(5, 1)
  @Post()
  create(@Body() dto: CreateTechDto) {
    return this.techService.create(dto);
  }

  @Get()
  findAll() {
    return this.techService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('tech:read_id')
  @RateLimit(20, 1)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('tech:update')
  @RateLimit(10, 1)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTechDto) {
    return this.techService.update(BigInt(id), dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('tech:delete')
  @RateLimit(10, 1)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techService.remove(BigInt(id));
  }
}
