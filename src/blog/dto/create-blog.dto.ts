import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
    @ApiProperty({ example: 'Título do Post', description: 'Título principal do post' })
    titulo: string;

    @ApiProperty({ example: 'Subtítulo interessante', description: 'Subtítulo do post', required: false })
    subtitulo: string;

    @ApiProperty({ example: 'Conteúdo completo do post...', description: 'Corpo do post' })
    conteudo: string;

    @ApiProperty({ example: 'https://exemplo.com/imagem.jpg', description: 'URL da imagem principal' })
    imagemUrl: string;
}