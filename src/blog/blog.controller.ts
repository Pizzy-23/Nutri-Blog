import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/admin/jwt/jwt-auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(+id, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id/repost')
  repost(@Param('id') id: string) {
    return this.blogService.repost(+id);
  }

}
