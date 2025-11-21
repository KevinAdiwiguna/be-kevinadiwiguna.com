import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/permission.guard';
import { RateLimitGuard } from 'src/rate-limit/rate-limit.guard';
import { Permission } from 'src/auth/permission.decorator';
import { RateLimit } from 'src/rate-limit/rate-limit.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('upload_files')
  @RateLimit(10, 1)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user?.id ? BigInt(req.user.id) : undefined;
    return this.filesService.uploadFile(file, userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard, RateLimitGuard)
  @Permission('upload_files')
  @RateLimit(10, 1)
  @Post("upload-many")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.uploadMany(files);
  }

}
