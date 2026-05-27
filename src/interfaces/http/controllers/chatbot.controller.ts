import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ProcessChatUseCase } from '../../../application/use-cases/chatbot/process-chat.use-case';
import { ChatRequestDto } from '../dtos/requests/chat-request.dto';
import { ChatResponseDto } from '../dtos/responses/chat-response.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly processChatUseCase: ProcessChatUseCase) {}

  @Post()
  @HttpCode(200)
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.processChatUseCase.execute(dto);
  }
}
