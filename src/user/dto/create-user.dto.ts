import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'O e-mail do usuário',
    example: 'contato@exemplo.com',
  })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;

  @ApiProperty({
    description: 'A senha do usuário (mínimo de 8 caracteres)',
    example: 'senhaForte123',
  })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'O papel do usuário (opcional, padrão é "default")',
    example: 'nutri',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'O papel deve ser "nutri" ou "default".' })
  role?: UserRole;
}
