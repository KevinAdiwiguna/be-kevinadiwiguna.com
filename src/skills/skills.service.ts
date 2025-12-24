import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSkillDto) {
    const exists = await this.prisma.skills.findUnique({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Skill name already exists');
    }

    return this.prisma.skills.create({
      data: { ...dto },
    });
  }

  async findAll() {
    return this.prisma.skills.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: bigint) {
    const skill = await this.prisma.skills.findUnique({
      where: { id },
    });

    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: bigint, dto: UpdateSkillDto) {
    await this.findOne(id);

    if (dto.name) {
      const exists = await this.prisma.skills.findUnique({
        where: { name: dto.name },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException('Skill name already exists');
      }
    }

    return this.prisma.skills.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return this.prisma.skills.delete({
      where: { id },
    });
  }
}
