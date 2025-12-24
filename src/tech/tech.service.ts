import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Injectable()
export class TechService {
  constructor(private prisma: PrismaService) {}
 
  async create(dto: CreateTechDto) {
    const isNameExist = await this.prisma.tech.findUnique({
      where: {
        name: dto.name,
      }
    })
    if(isNameExist) {
      throw new ConflictException("Name already Exist")
    }
    return await this.prisma.tech.create({
      data: dto,
    });
  }

  async findAll() {
    return await this.prisma.tech.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: bigint) {
    const tech = await this.prisma.tech.findUnique({
      where: { id },
    });

    if (!tech) throw new NotFoundException('Tech not found');

    return tech;
  }

  async update(id: bigint, dto: UpdateTechDto) {
    const exists = await this.prisma.tech.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Tech not found');

    return await this.prisma.tech.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: bigint) {
    const exists = await this.prisma.tech.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Tech not found');

    await this.prisma.tech.delete({
      where: { id },
    });

    return { message: 'Tech deleted successfully' };
  }
}
