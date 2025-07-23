import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../user/enums/user-role.enum';
import { Roles } from 'src/admin/decorators/roles.decorator';
import { RolesGuard } from 'src/admin/jwt/roles.guard';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Cria um novo post no blog (Apenas para Nutri)' })
  @ApiResponse({
    status: 201,
    description: 'Post criado com sucesso',
    type: Blog,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado (papel inválido)' })
  @ApiBody({ type: CreateBlogDto })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NUTRI)
  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @ApiOperation({ summary: 'Lista todos os posts do blog' })
  @ApiResponse({ status: 200, description: 'Lista de posts', type: [Blog] })
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @ApiOperation({ summary: 'Obtém um post específico' })
  @ApiParam({ name: 'id', description: 'ID do post', type: Number })
  @ApiResponse({ status: 200, description: 'Post encontrado', type: Blog })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza um post existente (Apenas para Nutri)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 403, description: 'Acesso negado (papel inválido)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NUTRI)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @ApiOperation({ summary: 'Republica um post (Apenas para Nutri)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 403, description: 'Acesso negado (papel inválido)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NUTRI)
  @Put(':id/repost')
  repost(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.repost(id);
  }
}
