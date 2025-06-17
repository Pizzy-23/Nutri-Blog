import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT para autenticação' })
    access_token: string;

    @ApiProperty({ example: 3600, description: 'Tempo de expiração do token em segundos' })
    expires_in: number;
}