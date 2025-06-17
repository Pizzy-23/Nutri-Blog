import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/admin/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @ApiOperation({ summary: 'Cria um novo post no blog' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Post criado com sucesso',
    type: Blog
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBody({ type: CreateBlogDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @ApiOperation({ summary: 'Lista todos os posts do blog' })
  @ApiResponse({
    status: 200,
    description: 'Lista de posts retornada com sucesso',
    type: [Blog]
  })
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @ApiOperation({ summary: 'Obtém um post específico' })
  @ApiParam({ name: 'id', description: 'ID do post', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Post encontrado',
    type: Blog
  })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza um post existente' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser atualizado', type: Number })
  @ApiBody({ type: UpdateBlogDto })
  @ApiResponse({
    status: 200,
    description: 'Post atualizado com sucesso',
    type: Blog
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Republica um post (desativa todos os outros e ativa este)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser republicado', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Post republicado com sucesso',
    type: Blog
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Put(':id/repost')
  repost(@Param('id') id: string) {
    return this.blogService.repost(+id);
  }
}