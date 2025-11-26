import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as multer from 'multer';
import { ArtifactsService } from './artifacts.service';
import { UploadAvatarResponseDto } from './dto/upload-avatar.dto';
import { GetAvatarResponseDto } from './dto/get-avatar.dto';
import { MulterFile } from './types';
import { AuthGuard } from '../interfaces/http/guards/auth.guard';

@ApiTags('Artifacts')
@Controller('artifacts')
export class ArtifactsController {
  constructor(private readonly artifactsService: ArtifactsService) {}

  @Post('avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faz upload do avatar do usuário autenticado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadAvatarResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: MulterFile,
  ) {
    const userId = req?.user?.id ?? req?.user?.sub;
    if (!userId) throw new BadRequestException('Usuário não autenticado ou token sem id');
    return this.artifactsService.uploadAvatar(String(userId), file);
  }

  @Get('avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém o avatar do usuário autenticado' })
  @ApiResponse({ status: 200, type: GetAvatarResponseDto })
  async getAvatar(@Req() req: any) {
    const userId = req?.user?.id ?? req?.user?.sub;
    if (!userId) throw new BadRequestException('Usuário não autenticado ou token sem id');
    return this.artifactsService.getAvatar(String(userId));
  }
}
