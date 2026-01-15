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
import { RateLimitGuard } from 'src/commons/guards/rate-limit.guard';
import { PermissionsGuard } from 'src/commons/guards/permission.guard';
import { Permission } from 'src/commons/decorators/permission.decorator';
import { RateLimit } from 'src/commons/decorators/rate-limit.decorator';

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

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('blog:read_own')
  @RateLimit(10, 1)
  @Get('/me/list')
  getMyBlogs(@Req() req: any) {
    return this.blogsService.getMyBlogs(BigInt(req.user.sub));
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('blog:create')
  @RateLimit(5, 1)
  @Post()
  create(@Req() req: any, @Body() dto: CreateBlogDto) {
    return this.blogsService.create(BigInt(req.user.sub), dto);
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('blog:delete')
  @RateLimit(5, 1)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.delete(BigInt(id), BigInt(req.user.sub));
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard, PermissionsGuard)
  @Permission('blog:update_status')
  @RateLimit(10, 1)
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
