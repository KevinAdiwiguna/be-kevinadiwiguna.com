import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { HerosService } from './heros.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/permission.guard';
import { Permission } from 'src/auth/permission.decorator';
import { EmptyDto } from 'src/types/Emty.dto';

@Controller('heros')
export class HerosController {
  constructor(private readonly herosService: HerosService) { }

  @Get('primary')
  async findPrimary(@Query() query: EmptyDto) {
    return await this.herosService.findPrimary();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('read_hero')
  @Get()
  findAll() {
    return this.herosService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('create_hero')
  @Post()
  create(@Body() dto: CreateHeroDto) {
    return this.herosService.create(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('read_hero_id')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: bigint) {
    return this.herosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('update_hero')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: bigint, @Body() dto: UpdateHeroDto) {
    return this.herosService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('delete_hero')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: bigint) {
    return this.herosService.remove(id);
  }
}
