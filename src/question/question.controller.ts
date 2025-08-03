import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { FileUploadService } from './file-upload.service';
import { TestSetService } from './test-set.service';
import {
  CreateQuestionDto,
  SubmitTestDto,
  UpdateQuestionDto,
  CreateTestSetDto,
  SubmitTestSetDto,
} from './dto';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(
    private questionService: QuestionService,
    private testSetService: TestSetService,
  ) {}

  // @UseGuards(JwtGuard)
  @Get('parts')
  getAllParts() {
    return this.questionService.getAllParts();
  }

  // @UseGuards(JwtGuard)
  @Get('part/:partId')
  getQuestionsByPart(
    @Param('partId', ParseIntPipe) partId: number,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit
      ? parseInt(limit, 10)
      : undefined;
    return this.questionService.getQuestionsByPart(
      partId,
      limitNumber,
    );
  }

  // @UseGuards(JwtGuard)
  @Get('random')
  getRandomQuestions(
    @Query('count') count?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const countNumber = count
      ? parseInt(count, 10)
      : 20;
    return this.questionService.getRandomQuestions(
      countNumber,
      difficulty,
    );
  }

  // @UseGuards(JwtGuard)
  @Get(':id')
  getQuestionById(
    @Param('id', ParseIntPipe) questionId: number,
  ) {
    return this.questionService.getQuestionById(
      questionId,
    );
  }

  @UseGuards(JwtGuard)
  @Post()
  createQuestion(
    @GetUser('id') userId: number,
    @Body() dto: CreateQuestionDto,
  ) {
    // Only admins should be able to create questions
    // You might want to add role-based authorization here
    return this.questionService.createQuestion(
      dto,
    );
  }

  @UseGuards(JwtGuard)
  @Post('submit-test')
  submitTest(
    @GetUser('id') userId: number,
    @Body() dto: SubmitTestDto,
  ) {
    return this.questionService.submitTest(
      userId,
      dto,
    );
  }

  @UseGuards(JwtGuard)
  @Get('user/results')
  getUserTestResults(
    @GetUser('id') userId: number,
  ) {
    return this.questionService.getUserTestResults(
      userId,
    );
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateQuestion(
    @Param('id', ParseIntPipe) questionId: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.updateQuestion(
      questionId,
      dto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteQuestion(
    @Param('id', ParseIntPipe) questionId: number,
  ) {
    return this.questionService.deleteQuestion(
      questionId,
    );
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      2,
      FileUploadService.getMulterConfig(),
    ),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const fileUploadService =
      new FileUploadService();

    const uploadPromises = files.map(
      async (file) => {
        const fileName =
          await fileUploadService.uploadFile(
            file,
          );
        const type = file.mimetype.startsWith(
          'image/',
        )
          ? 'image'
          : 'audio';

        return {
          fieldname: file.fieldname,
          filename: fileName,
          url: fileUploadService.generateFileUrl(
            fileName,
          ),
          type,
        };
      },
    );

    const uploadedFiles = await Promise.all(
      uploadPromises,
    );
    return { files: uploadedFiles };
  }

  // ===== TEST SET MANAGEMENT =====
  @Get('test-sets/generate')
  getGenerateTestSetget() {
    return 'oK';
  }

  @UseGuards(JwtGuard)
  @Post('test-sets/generate')
  generateTestSet(
    @GetUser('id') userId: number,
    @Body() dto: CreateTestSetDto,
  ) {
    console.log(
      'Generating test set for user:',
      userId,
    );
    // Validate dto here if needed
    // You might want to add additional validation logic
    // Proceed with generating the test set
    return this.testSetService.generateTestSet(
      userId,
      dto,
    );
  }

  @UseGuards(JwtGuard)
  @Get('test-sets/my')
  getMyTestSets(@GetUser('id') userId: number) {
    return this.testSetService.getUserTestSets(
      userId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('test-sets/abandoned')
  getAbandonedTestSets(
    @GetUser('id') userId: number,
  ) {
    return this.testSetService.getAbandonedTestSets(
      userId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('test-sets/:id')
  getTestSet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) testSetId: number,
  ) {
    return this.testSetService.getTestSetById(
      testSetId,
    );
  }

  @UseGuards(JwtGuard)
  @Post('test-sets/:id/start')
  startTestSet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) testSetId: number,
  ) {
    return this.testSetService.startTest(
      userId,
      testSetId,
    );
  }

  @UseGuards(JwtGuard)
  @Post('test-sets/submit')
  submitTestSet(
    @GetUser('id') userId: number,
    @Body() dto: SubmitTestSetDto,
  ) {
    return this.testSetService.submitTestSet(
      userId,
      dto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('test-sets/:id')
  deleteTestSet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) testSetId: number,
  ) {
    return this.testSetService.deleteTestSet(
      userId,
      testSetId,
    );
  }

  // ===== TEST HISTORY & ANALYTICS =====

  @UseGuards(JwtGuard)
  @Get('test-sets/history/my')
  getMyTestHistory(
    @GetUser('id') userId: number,
  ) {
    return this.testSetService.getUserTestHistory(
      userId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('test-sets/statistics/my')
  getMyStatistics(@GetUser('id') userId: number) {
    return this.testSetService.getUserStatistics(
      userId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('test-sets/:id/review')
  reviewTestSet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) testSetId: number,
  ) {
    return this.testSetService.getTestSetWithAnswers(
      testSetId,
      userId,
    );
  }

  // ===== ADMIN ENDPOINTS =====

  @UseGuards(JwtGuard)
  @Get('admin/test-sets/all-history')
  getAllUsersTestHistory() {
    // TODO: Add admin role check
    return this.testSetService.getAllUsersTestHistory();
  }

  @UseGuards(JwtGuard)
  @Get('admin/users/:userId/test-history')
  getSpecificUserTestHistory(
    @Param('userId', ParseIntPipe)
    targetUserId: number,
  ) {
    // TODO: Add admin role check
    return this.testSetService.getSpecificUserTestHistory(
      targetUserId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('admin/users/:userId/statistics')
  getSpecificUserStatistics(
    @Param('userId', ParseIntPipe)
    targetUserId: number,
  ) {
    // TODO: Add admin role check
    return this.testSetService.getUserStatistics(
      targetUserId,
    );
  }

  @UseGuards(JwtGuard)
  @Get('admin/test-sets/:id/review')
  adminReviewTestSet(
    @Param('id', ParseIntPipe) testSetId: number,
  ) {
    // TODO: Add admin role check
    return this.testSetService.getTestSetWithAnswers(
      testSetId,
    );
  }
}
