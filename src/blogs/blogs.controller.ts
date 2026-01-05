import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { UpdateBlogStatusDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  getAll() {
    return this.blogsService.getAllPublished();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.blogsService.getBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/list')
  getMyBlogs(@Req() req: any) {
    return this.blogsService.getMyBlogs(BigInt(req.user.sub));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateBlogDto) {
    return this.blogsService.create(BigInt(req.user.sub), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.delete(BigInt(id), BigInt(req.user.sub));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateBlogStatusDto,
  ) {
    const blogId = BigInt(id);
    const userId = BigInt(req.user.sub);
    return this.blogsService.updateStatus(blogId, userId, dto);
  }
}
