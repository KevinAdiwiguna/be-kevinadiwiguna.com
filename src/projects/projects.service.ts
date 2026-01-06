import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project.dto';
import slugify from 'slugify';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllPublished() {
    return this.prisma.projects.findMany({
      where: { published: true },
      include: {
        techs: {
          include: { tech: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdminAll() {
    return this.prisma.projects.findMany({
      include: {
        techs: { include: { tech: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeatured() {
    return this.prisma.projects.findMany({
      where: { published: true, isFeatured: true },
      include: {
        techs: { include: { tech: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateProjectDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.projects.create({
        data: {
          name: dto.name,
          slug,
          repoUrl: dto.repoUrl,
          demoUrl: dto.demoUrl,
          thumbnail: dto.thumbnail,
          description: dto.description,
          isFeatured: dto.isFeatured ?? false,
          published: dto.published ?? false,
        },
      });

      if (dto.techs?.length) {
        const normalizedTechs = dto.techs.map((t) => t.toLowerCase().trim());

        const existingTechs = await tx.tech.findMany({
          where: { name: { in: normalizedTechs } },
        });

        const existingTechNames = new Set(existingTechs.map((t) => t.name));

        const newTechNames = normalizedTechs.filter(
          (name) => !existingTechNames.has(name),
        );

        if (newTechNames.length) {
          await tx.tech.createMany({
            data: newTechNames.map((name) => ({ name })),
            skipDuplicates: true,
          });
        }

        const allTechs = await tx.tech.findMany({
          where: { name: { in: normalizedTechs } },
        });

        await tx.project_tech.createMany({
          data: allTechs.map((tech) => ({
            projectId: project.id,
            techId: tech.id,
          })),
        });
      }

      return project;
    });
  }

  async delete(projectId: bigint) {
    const project = await this.prisma.projects.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Project not found');

    await this.prisma.projects.delete({ where: { id: projectId } });

    return { message: 'Project deleted successfully' };
  }

  async getBySlug(slug: string) {
    const project = await this.prisma.projects.findFirst({
      where: { slug, published: true },
      include: { techs: { include: { tech: true } } },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async togglePublish(projectId: bigint) {
    const project = await this.prisma.projects.findUnique({
      where: { id: projectId },
      select: { published: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projects.update({
      where: { id: projectId },
      data: {
        published: !project.published,
      },
    });
  }

  async toggleFeatured(projectId: bigint) {
    const project = await this.prisma.projects.findUnique({
      where: { id: projectId },
      select: { isFeatured: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projects.update({
      where: { id: projectId },
      data: {
        isFeatured: !project.isFeatured,
      },
    });
  }
}
