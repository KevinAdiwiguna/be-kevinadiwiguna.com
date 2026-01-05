import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2.client';
import { randomBytes, randomUUID } from 'crypto';
import { files as FileModel } from 'generated/client';
import 'dotenv/config';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  private generateKey(originalName: string, folder = 'uploads') {
    const ext = originalName.split('.').pop();
    const random = randomBytes(12).toString('hex');

    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '');

    return `${safeFolder}/${random}.${ext}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: {
      ownerId?: bigint;
      folder?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const bucket = process.env.R2_BUCKET!;
    const key = this.generateKey(
      file.originalname,
      options?.folder ?? 'uploads',
    );

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `${process.env.R2_PROD_PUBLIC_URL}/${key}`;

    return this.prisma.files.create({
      data: {
        key,
        url,
        mime: file.mimetype,
        size: file.size,
        bucket,
        ownerId: options?.ownerId ?? null,
      },
    });
  }

  async uploadMany(
    files: Express.Multer.File[],
    options?: {
      ownerId?: bigint;
      folder?: string;
    },
  ) {
    const results: FileModel[] = [];
    const bucket = process.env.R2_BUCKET!;

    for (const file of files) {
      const key = this.generateKey(
        file.originalname,
        options?.folder ?? 'uploads',
      );

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `${process.env.R2_PROD_PUBLIC_URL}/${key}`;

      const saved = await this.prisma.files.create({
        data: {
          key,
          url,
          mime: file.mimetype,
          size: file.size,
          bucket,
          ownerId: options?.ownerId ?? null,
        },
      });

      results.push(saved);
    }

    return results;
  }

  async findAll(ownerId?: bigint) {
    return this.prisma.files.findMany({
      where: ownerId ? { ownerId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async delete(id: bigint) {
    const file = await this.prisma.files.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: file.bucket,
        Key: file.key,
      }),
    );

    await this.prisma.files.delete({
      where: { id },
    });

    return { success: true };
  }
}
