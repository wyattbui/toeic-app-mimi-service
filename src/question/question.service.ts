import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateQuestionDto,
  SubmitTestDto,
  UpdateQuestionDto,
} from './dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // Get all questions by part
  async getQuestionsByPart(
    partId: number,
    limit?: number,
  ) {
    return this.prisma.question.findMany({
      where: { partId },
      include: {
        options: true,
        part: true,
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  // Get random questions for practice
  async getRandomQuestions(
    count = 20,
    difficulty?: string,
  ) {
    const whereClause = difficulty
      ? { difficulty }
      : {};

    const questions =
      await this.prisma.question.findMany({
        where: whereClause,
        include: {
          options: true,
          part: true,
        },
        orderBy: { id: 'asc' },
      });

    // Shuffle and take random questions
    const shuffled = questions.sort(
      () => 0.5 - Math.random(),
    );
    return shuffled.slice(0, count);
  }

  // Get question by id with options
  async getQuestionById(questionId: number) {
    const question =
      await this.prisma.question.findUnique({
        where: { id: questionId },
        include: {
          options: true,
          part: true,
        },
      });

    if (!question) {
      throw new NotFoundException(
        'Question not found',
      );
    }

    return question;
  }

  // Create new question with options
  async createQuestion(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        partId: dto.partId,
        questionText: dto.questionText,
        questionType: dto.questionType,
        difficulty: dto.difficulty,
        explanation: dto.explanation,
        audioUrl: dto.audioUrl,
        imageUrl: dto.imageUrl,
        passageText: dto.passageText,
        passageTitle: dto.passageTitle,
        options: {
          create: dto.options,
        },
      },
      include: {
        options: true,
        part: true,
      },
    });
  }

  // Update question
  async updateQuestion(
    questionId: number,
    dto: UpdateQuestionDto,
  ) {
    const question =
      await this.prisma.question.findUnique({
        where: { id: questionId },
      });

    if (!question) {
      throw new NotFoundException(
        'Question not found',
      );
    }

    // If options are provided, update them
    if (dto.options) {
      // Delete existing options
      await this.prisma.option.deleteMany({
        where: { questionId },
      });

      // Create new options
      await this.prisma.option.createMany({
        data: dto.options.map((option) => ({
          ...option,
          questionId,
        })),
      });
    }

    // Update question
    const { options, ...questionData } = dto;
    return this.prisma.question.update({
      where: { id: questionId },
      data: questionData,
      include: {
        options: true,
        part: true,
      },
    });
  }

  // Delete question
  async deleteQuestion(questionId: number) {
    const question =
      await this.prisma.question.findUnique({
        where: { id: questionId },
      });

    if (!question) {
      throw new NotFoundException(
        'Question not found',
      );
    }

    // Delete associated options first
    await this.prisma.option.deleteMany({
      where: { questionId },
    });

    // Delete question
    await this.prisma.question.delete({
      where: { id: questionId },
    });

    return { message: 'Question deleted successfully' };
  }

  // Submit test and calculate score
  async submitTest(
    userId: number,
    dto: SubmitTestDto,
  ) {
    // Create test result
    const testResult =
      await this.prisma.testResult.create({
        data: {
          userId,
          testType: dto.testType,
          duration: dto.duration,
          totalScore: 0, // Will calculate later
          listeningScore: 0,
          readingScore: 0,
        },
      });

    let correctAnswers = 0;
    let listeningCorrect = 0;
    let readingCorrect = 0;

    // Process each answer
    for (const answer of dto.answers) {
      const question =
        await this.prisma.question.findUnique({
          where: { id: answer.questionId },
          include: {
            options: true,
            part: true,
          },
        });

      if (!question) continue;

      const correctOption = question.options.find(
        (opt) => opt.isCorrect,
      );
      const isCorrect =
        correctOption?.optionLetter ===
        answer.selectedOption;

      // Create user answer
      await this.prisma.userAnswer.create({
        data: {
          testResultId: testResult.id,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect,
          timeSpent: answer.timeSpent,
        },
      });

      if (isCorrect) {
        correctAnswers++;
        if (
          question.part.skillType === 'Listening'
        ) {
          listeningCorrect++;
        } else {
          readingCorrect++;
        }
      }
    }

    // Calculate TOEIC scores (simplified)
    const totalScore = this.calculateTOEICScore(
      correctAnswers,
      dto.answers.length,
    );
    const listeningScore =
      this.calculateTOEICScore(
        listeningCorrect,
        100,
      ); // Simplified
    const readingScore =
      totalScore - listeningScore;

    // Update test result with scores
    const updatedResult =
      await this.prisma.testResult.update({
        where: { id: testResult.id },
        data: {
          totalScore,
          listeningScore,
          readingScore,
        },
        include: {
          answers: {
            include: {
              question: {
                include: {
                  options: true,
                  part: true,
                },
              },
            },
          },
        },
      });

    return updatedResult;
  }

  // Get user's test results
  async getUserTestResults(userId: number) {
    return this.prisma.testResult.findMany({
      where: { userId },
      include: {
        answers: {
          include: {
            question: {
              include: {
                options: true,
                part: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get all parts
  async getAllParts() {
    return this.prisma.part.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { partNumber: 'asc' },
    });
  }

  // Private helper methods
  private calculateTOEICScore(
    correct: number,
    total: number,
  ): number {
    if (total === 0) return 0;
    const percentage = correct / total;
    return Math.round(percentage * 495); // Max score per section is 495
  }
}
