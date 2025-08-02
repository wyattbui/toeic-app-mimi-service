import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { QuestionService } from './question.service';
import {
  CreateQuestionDto,
  SubmitTestDto,
  CreateBookmarkDto,
} from './dto';

@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  // Public endpoints (no auth required)
  @Get('parts')
  getAllParts() {
    return this.questionService.getAllParts();
  }

  @Get('part/:partId')
  getQuestionsByPart(
    @Param('partId', ParseIntPipe) partId: number,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.questionService.getQuestionsByPart(partId, limitNumber);
  }

  @Get('random')
  getRandomQuestions(
    @Query('count') count?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const countNumber = count ? parseInt(count, 10) : 20;
    return this.questionService.getRandomQuestions(countNumber, difficulty);
  }

  @Get(':id')
  getQuestionById(@Param('id', ParseIntPipe) questionId: number) {
    return this.questionService.getQuestionById(questionId);
  }

  // Protected endpoints (auth required)
  @UseGuards(JwtGuard)
  @Post()
  createQuestion(
    @GetUser('id') userId: number,
    @Body() dto: CreateQuestionDto,
  ) {
    // Only admins should be able to create questions
    // You might want to add role-based authorization here
    return this.questionService.createQuestion(dto);
  }

  @UseGuards(JwtGuard)
  @Post('submit-test')
  submitTest(
    @GetUser('id') userId: number,
    @Body() dto: SubmitTestDto,
  ) {
    return this.questionService.submitTest(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Get('user/results')
  getUserTestResults(@GetUser('id') userId: number) {
    return this.questionService.getUserTestResults(userId);
  }

  // Bookmark endpoints
  @UseGuards(JwtGuard)
  @Get('user/bookmarks')
  getUserBookmarks(@GetUser('id') userId: number) {
    return this.questionService.getUserBookmarks(userId);
  }

  @UseGuards(JwtGuard)
  @Post('bookmarks')
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.questionService.createBookmark(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('bookmarks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.questionService.removeBookmark(userId, bookmarkId);
  }
}
