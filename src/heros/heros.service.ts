import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HerosService {
  constructor(private prisma: PrismaService) { }
  
  async create(createHeroDto: CreateHeroDto) {
    if (createHeroDto.isPrimary) {
      await this.prisma.heroes.updateMany({
        where: { isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.heroes.create({ data: createHeroDto });
  }

  async findAll() {
    return await this.prisma.heroes.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: bigint) {
    const hero = await this.prisma.heroes.findUnique({ where: { id } });
    if (!hero) throw new NotFoundException('Hero not found');
    return hero;
  }

  async findPrimary() {
    const hero = await this.prisma.heroes.findFirst({ where: { isPrimary: true } });
    if (!hero) throw new NotFoundException('Hero not found');
    return hero;
  }

  async update(id: bigint, dto: UpdateHeroDto) {
    const hero = await this.prisma.heroes.findUnique({ where: { id } });
    if (!hero) throw new NotFoundException('Hero not found');

    const getPrimary = await this.prisma.heroes.findFirst({
      where: {
        isPrimary: true,
        id: { not: id },
      },
    });
    
    let temp = false;
    if (getPrimary) {
      temp = false
    } else {
      temp = dto.isPrimary as boolean
    }

    const update = await this.prisma.heroes.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        cvLink: dto.cvLink,
        githubLink: dto.githubLink,
        phoneNumber: dto.phoneNumber,
        isPrimary: temp
      }
    })
    return update
  }

  async remove(id: bigint) {
    const hero = await this.prisma.heroes.findUnique({ where: { id } });
    if (!hero) throw new NotFoundException('Hero not found');
    return this.prisma.heroes.delete({ where: { id } });
  }

}
