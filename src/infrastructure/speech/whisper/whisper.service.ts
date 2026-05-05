import { Injectable } from '@nestjs/common';
import whisper from 'whisper-node';

@Injectable()
export class WhisperService {
  async transcribe(filePath: string): Promise<string> {
    const result = await whisper(filePath);

    if (!Array.isArray(result)) return '';

    return result.map((item: any) => item.speech).join(' ').trim();
  }
}