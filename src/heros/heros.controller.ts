import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { HerosService } from './heros.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';

@Controller('heros')
export class HerosController {
  constructor(private readonly herosService: HerosService) {}

  @Get('primary')
  async findPrimary() {
    return await this.herosService.findPrimary();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('hero:read')
  @RateLimit(10, 1)
  @Get()
  findAll() {
    return this.herosService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('hero:create')
  @RateLimit(3, 1)
  @Post()
  create(@Body() dto: CreateHeroDto) {
    return this.herosService.create(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hero:read_id')
  @RateLimit(15, 1)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: bigint) {
    return this.herosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('hero:update')
  @Patch(':id')
  @RateLimit(15, 1)
  update(@Param('id', ParseIntPipe) id: bigint, @Body() dto: UpdateHeroDto) {
    return this.herosService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('hero:delete')
  @RateLimit(10, 1)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: bigint) {
    return this.herosService.remove(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('hero:set_primary')
  @RateLimit(10, 1)
  @Patch(':id/set-primary')
  setPrimary(@Param('id') id: string) {
    return this.herosService.setPrimary(BigInt(id));
  }
}
