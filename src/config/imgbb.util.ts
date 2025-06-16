import axios from 'axios';

export async function uploadToImgbb(
    imageBuffer: Buffer,
    filename: string,
    apiKey: string,
): Promise<any> {
    const base64Image = imageBuffer.toString('base64');

    const params = new URLSearchParams();
    params.append('image', base64Image);
    params.append('name', filename);

    const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        params,
    );

    return response.data;
}
