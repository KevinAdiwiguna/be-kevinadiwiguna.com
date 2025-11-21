import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2.client';
import { randomBytes, randomUUID } from 'crypto';
import { files as FileModel } from 'generated/client';
import "dotenv/config";

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  private generateKey(originalName: string) {
    const ext = originalName.split('.').pop();
    const random = randomBytes(12).toString('hex');
    return `uploads/${random}.${ext}`;
  }

  async uploadFile(file: Express.Multer.File, ownerId?: bigint) {
    const bucket = process.env.R2_BUCKET!;
    const key = this.generateKey(file.originalname);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `${process.env.R2_PUBLIC_URL!}/${key}`;

    const saved = await this.prisma.files.create({
      data: {
        key,
        url,
        mime: file.mimetype,
        size: file.size,
        bucket,
        ownerId: ownerId ?? null,
      },
    });

    return saved;
  }

  async uploadMany(files: Express.Multer.File[], ownerId?: bigint) {
    const results: FileModel[] = [];

    const bucket = process.env.R2_BUCKET!;

    for (const file of files) {
      const key = this.generateKey(file.originalname);

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `${process.env.R2_PUBLIC_URL!}/${key}`;

      const saved = await this.prisma.files.create({
        data: {
          key,
          url,
          mime: file.mimetype,
          size: file.size,
          bucket,
          ownerId: ownerId ?? null,
        },
      });

      results.push(saved);
    }

    return results;
  }
}
