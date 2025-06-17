import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadToImgbb } from './imgbb.util';
import {
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload de arquivo para o ImgBB' })
    @ApiResponse({
        status: 201,
        description: 'Arquivo enviado com sucesso e URL retornada',
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    example: 'https://i.ibb.co/example.jpg',
                    description: 'URL da imagem no ImgBB'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Nenhum arquivo foi enviado ou formato inválido'
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao processar o upload'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Arquivo a ser enviado',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo de imagem (JPG, PNG, etc)'
                }
            }
        }
    })
    async upload(@UploadedFile() file: Express.Multer.File) {
        const apiKey = process.env.IMGBB_API_KEY;
        const imageUrl = await uploadToImgbb(file.buffer, file.originalname, apiKey);
        return { url: imageUrl };
    }
}