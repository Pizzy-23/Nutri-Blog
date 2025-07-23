import {
  Controller,
  Get,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/admin/decorators/roles.decorator';
import { RolesGuard } from 'src/admin/jwt/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.NUTRI)
  @ApiOperation({ summary: 'Listar todos os usuários (Apenas para Nutri)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários.',
    isArray: true,
    type: User,
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo usuário (default ou nutri)' })
  @ApiResponse({ status: 201, description: 'Usuário criado.', type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter dados de um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Dados do usuário.', type: User })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
}
