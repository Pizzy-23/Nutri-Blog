import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';


@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Login de administrador' })
  @ApiBody({
    description: 'Credenciais de login',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'senha123' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  login(@Body() body: { username: string, password: string }) {
    return this.authService.login(body.username, body.password);
  }
}