import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto {
    titulo?: string;
    subtitulo?: string;
    conteudo?: string;
    imagemUrl?: string;
}

