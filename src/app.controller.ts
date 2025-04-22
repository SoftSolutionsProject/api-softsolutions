import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): any {
    return {
      status: '🟢 API SoftSolutions está no ar',
      versao: '1.0.0',
      ambiente: process.env.NODE_ENV || 'desenvolvimento',
      hora: new Date().toISOString(),
    };
  }
}
