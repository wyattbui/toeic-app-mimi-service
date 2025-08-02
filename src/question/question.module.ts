import { Module } from '@nestjs/common';
import { BookmarkController } from './question.controller';
import { BookmarkService } from './questtion.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService]
})
export class BookmarkModule {}
