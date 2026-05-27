import { Module } from '@nestjs/common';
import { SearchModule } from './search.module';
import { ChatbotController } from '../interfaces/http/controllers/chatbot.controller';
import { ProcessChatUseCase } from '../application/use-cases/chatbot/process-chat.use-case';
import { OpenaiService } from '../infrastructure/chatbot/openai/openai.service';

@Module({
  imports: [SearchModule],
  controllers: [ChatbotController],
  providers: [ProcessChatUseCase, OpenaiService],
  exports: [ProcessChatUseCase],
})
export class ChatbotModule {}
