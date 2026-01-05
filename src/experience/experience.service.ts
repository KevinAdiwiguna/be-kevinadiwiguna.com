import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExperienceDto) {
    const owner = await this.prisma.users.findFirst({
      where: { role: { name: 'superadmin' } },
    });
    if (!owner) throw new NotFoundException('Owner not found');

    const getCompanyName = await this.prisma.experiences.findUnique({
      where: { companyName: dto.companyName },
    });
    if (getCompanyName) {
      throw new ConflictException('CompanyName already exists');
    }

    let durationMonths: number | null = null;

    if (dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);

      durationMonths =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
    }

    return await this.prisma.experiences.create({
      data: {
        ...dto,
        durationMonths,
        ownerId: owner.id,
      },
    });
  }

  async findAll() {
    return await this.prisma.experiences.findMany({
      include: { owner: true },
    });
  }

  async findOne(id: bigint) {
    const exp = await this.prisma.experiences.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!exp) throw new NotFoundException('Experience not found');
    return exp;
  }

  async update(id: bigint, dto: UpdateExperienceDto) {
    const exp = await this.findOne(id);

    return await this.prisma.experiences.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: bigint) {
    const exp = await this.findOne(id);
    return await this.prisma.experiences.delete({
      where: { id },
    });
  }
}
