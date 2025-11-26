export interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname?: string;
}
