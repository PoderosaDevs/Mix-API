import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export class UploadService {
  async uploadImage(fileBase64: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'Paraiso/products',
      });
      return result.secure_url;
    } catch (error) {
      throw new Error('Falha ao fazer upload da imagem');
    }
  }
}