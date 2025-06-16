import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadToImgbb } from './imgbb.util';

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const apiKey = process.env.IMGBB_API_KEY;
        const imageUrl = await uploadToImgbb(file.buffer, file.originalname, apiKey);
        return { url: imageUrl };
    }
}
