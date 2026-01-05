import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBlogStatusDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async getAllPublished() {
    return this.prisma.blogs.findMany({
      where: { published: true },
      include: {
        author: {
          select: { id: true, name: true },
        },
        techs: {
          include: { tech: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyBlogs(userId: bigint) {
    return this.prisma.blogs.findMany({
      where: { authorId: userId },
      include: {
        techs: {
          include: { tech: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: bigint, dto: CreateBlogDto) {
    const slug = slugify(dto.title, {
      lower: true,
      strict: true,
    });

    return this.prisma.$transaction(async (tx) => {
      const blog = await tx.blogs.create({
        data: {
          title: dto.title,
          slug,
          content: dto.content,
          thumbnail: dto.thumbnail,
          published: dto.published,
          authorId: userId,
        },
      });

      if (dto.techs?.length) {
        const normalizedTechs = dto.techs.map((t) => t.toLowerCase().trim());

        const existingTechs = await tx.tech.findMany({
          where: {
            name: {
              in: normalizedTechs,
            },
          },
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
          where: {
            name: {
              in: normalizedTechs,
            },
          },
        });

        await tx.blog_tech.createMany({
          data: allTechs.map((tech) => ({
            blogId: blog.id,
            techId: tech.id,
          })),
        });
      }

      return blog;
    });
  }

  async delete(blogId: bigint, userId: bigint) {
    const blog = await this.prisma.blogs.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.authorId !== userId) {
      throw new ForbiddenException('You are not the author');
    }

    await this.prisma.blogs.delete({
      where: { id: blogId },
    });

    return { message: 'Blog deleted successfully' };
  }

  async getBySlug(slug: string) {
    const blog = await this.prisma.blogs.findFirst({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        techs: {
          include: { tech: true },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async updateStatus(blogId: bigint, userId: bigint, dto: UpdateBlogStatusDto) {
    const blog = await this.prisma.blogs.findUnique({
      where: { id: blogId },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.authorId !== userId)
      throw new ForbiddenException('You are not the author');

    return this.prisma.blogs.update({
      where: { id: blogId },
      data: { published: dto.published },
    });
  }
}
