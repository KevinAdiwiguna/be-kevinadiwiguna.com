import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  UploadedFiles,
  Get,
  Delete,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('file:upload')
  @RateLimit(10, 1)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.filesService.uploadFile(file, {
      ownerId: BigInt(req.user.sub),
      folder,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('file:upload_many')
  @RateLimit(10, 1)
  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string,
    @Req() req: any,
  ) {
    if (!files?.length) {
      throw new BadRequestException('Files are required');
    }

    return this.filesService.uploadMany(files, {
      ownerId: BigInt(req.user.sub),
      folder,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('file:read')
  @RateLimit(10, 1)
  @Get()
  findAll(@Req() req: Request) {
    return this.filesService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('file:delete')
  @RateLimit(10, 1)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.filesService.delete(BigInt(id));
  }
}
