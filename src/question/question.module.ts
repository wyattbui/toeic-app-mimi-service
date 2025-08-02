import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TestSetService } from './test-set.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, TestSetService],
})
export class QuestionModule {}
