import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from '../../../application/email/use-cases/email.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}