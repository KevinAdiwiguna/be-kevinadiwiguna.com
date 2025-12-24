import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TechService } from './tech.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Controller('tech')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @Post()
  create(@Body() dto: CreateTechDto) {
    return this.techService.create(dto);
  }

  @Get()
  findAll() {
    return this.techService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTechDto) {
    return this.techService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techService.remove(BigInt(id));
  }
}
