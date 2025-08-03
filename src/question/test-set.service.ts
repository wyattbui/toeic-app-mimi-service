import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTestSetDto,
  SubmitTestSetDto,
} from './dto';

@Injectable()
export class TestSetService {
  constructor(private prisma: PrismaService) {}

  // Generate random test set for user by part
  async generateTestSet(
    userId: number,
    dto: CreateTestSetDto,
  ) {
    // Validate part exists
    const part =
      await this.prisma.part.findUnique({
        where: { id: dto.partId },
      });

    if (!part) {
      throw new NotFoundException(
        'Part not found',
      );
    }

    // Get available questions from the part
    const whereClause: any = {
      partId: dto.partId,
    };
    if (dto.difficulty) {
      whereClause.difficulty = dto.difficulty;
    }

    const availableQuestions =
      await this.prisma.question.findMany({
        where: whereClause,
        include: {
          options: true,
        },
      });

    if (
      availableQuestions.length <
      dto.questionCount
    ) {
      // throw new BadRequestException(
      //   `Not enough questions available. Found ${availableQuestions.length}, need ${dto.questionCount}`,
      // );
      console.error(
        `Not enough questions available. Found ${availableQuestions.length}, need ${dto.questionCount}`,
      );
    }

    // Shuffle and select random questions
    const shuffledQuestions = availableQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, dto.questionCount);

    // Create test set
    const testSet =
      await this.prisma.testSet.create({
        data: {
          userId,
          partId: dto.partId,
          title: dto.title,
          description: dto.description,
          questionCount: dto.questionCount,
          timeLimit: dto.timeLimit,
          difficulty: dto.difficulty,
        },
      });

    // Add questions to test set
    const testSetQuestions =
      shuffledQuestions.map(
        (question, index) => ({
          testSetId: testSet.id,
          questionId: question.id,
          orderIndex: index + 1,
        }),
      );

    await this.prisma.testSetQuestion.createMany({
      data: testSetQuestions,
    });

    // Return test set with questions
    return this.getTestSetById(testSet.id);
  }

  // Get test set by ID with questions
  async getTestSetById(testSetId: number) {
    const testSet =
      await this.prisma.testSet.findUnique({
        where: { id: testSetId },
        include: {
          part: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                  part: true,
                },
              },
            },
            orderBy: { orderIndex: 'asc' },
          },
          answers: {
            include: {
              question: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

    if (!testSet) {
      throw new NotFoundException(
        'Test set not found',
      );
    }

    return testSet;
  }

  // Get user's test sets
  async getUserTestSets(userId: number) {
    return this.prisma.testSet.findMany({
      where: { userId },
      include: {
        part: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Start test (mark as in_progress)
  async startTest(
    userId: number,
    testSetId: number,
  ) {
    const testSet =
      await this.prisma.testSet.findFirst({
        where: {
          id: testSetId,
          userId,
        },
      });

    if (!testSet) {
      throw new NotFoundException(
        'Test set not found',
      );
    }

    if (testSet.status !== 'created') {
      throw new BadRequestException(
        `Cannot start test with status: ${testSet.status}`,
      );
    }

    return this.prisma.testSet.update({
      where: { id: testSetId },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      },
    });
  }

  // Submit test answers
  async submitTestSet(
    userId: number,
    dto: SubmitTestSetDto,
  ) {
    const testSet =
      await this.prisma.testSet.findFirst({
        where: {
          id: dto.testSetId,
          userId,
        },
        include: {
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });

    if (!testSet) {
      throw new NotFoundException(
        'Test set not found',
      );
    }

    if (testSet.status === 'completed') {
      throw new BadRequestException(
        'Test set already completed',
      );
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;

    // Process each answer
    for (const answerDto of dto.answers) {
      const testQuestion = testSet.questions.find(
        (tq) =>
          tq.questionId === answerDto.questionId,
      );

      if (!testQuestion) {
        continue; // Skip invalid question IDs
      }

      const correctOption =
        testQuestion.question.options.find(
          (opt) => opt.isCorrect,
        );

      const isCorrect =
        answerDto.selectedOption &&
        correctOption?.optionLetter ===
          answerDto.selectedOption;

      if (isCorrect) {
        correctAnswers++;
      } else if (answerDto.selectedOption) {
        wrongAnswers++;
      }

      // Save answer
      await this.prisma.testSetAnswer.upsert({
        where: {
          testSetId_questionId: {
            testSetId: dto.testSetId,
            questionId: answerDto.questionId,
          },
        },
        update: {
          selectedOption:
            answerDto.selectedOption,
          isCorrect,
          timeSpent: answerDto.timeSpent,
        },
        create: {
          testSetId: dto.testSetId,
          questionId: answerDto.questionId,
          selectedOption:
            answerDto.selectedOption,
          isCorrect,
          timeSpent: answerDto.timeSpent,
        },
      });
    }

    // Calculate score (simple percentage)
    const totalScore = Math.round(
      (correctAnswers / testSet.questionCount) *
        100,
    );

    // Update test set
    const updatedTestSet =
      await this.prisma.testSet.update({
        where: { id: dto.testSetId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          totalScore,
          correctAnswers,
          wrongAnswers,
        },
        include: {
          part: true,
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
            orderBy: { orderIndex: 'asc' },
          },
          answers: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });

    return updatedTestSet;
  }

  // Get abandoned test sets (created but not completed)
  async getAbandonedTestSets(userId: number) {
    return this.prisma.testSet.findMany({
      where: {
        userId,
        status: {
          in: ['created', 'in_progress'],
        },
        createdAt: {
          lt: new Date(
            Date.now() - 24 * 60 * 60 * 1000,
          ), // Older than 24h
        },
      },
      include: {
        part: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Delete test set
  async deleteTestSet(
    userId: number,
    testSetId: number,
  ) {
    const testSet =
      await this.prisma.testSet.findFirst({
        where: {
          id: testSetId,
          userId,
        },
      });

    if (!testSet) {
      throw new NotFoundException(
        'Test set not found',
      );
    }

    // Delete related records first
    await this.prisma.testSetAnswer.deleteMany({
      where: { testSetId },
    });

    await this.prisma.testSetQuestion.deleteMany({
      where: { testSetId },
    });

    await this.prisma.testSet.delete({
      where: { id: testSetId },
    });

    return {
      message: 'Test set deleted successfully',
    };
  }

  // Get user's test history with detailed results
  async getUserTestHistory(userId: number) {
    return this.prisma.testSet.findMany({
      where: {
        userId,
        status: 'completed', // Only completed tests
      },
      include: {
        part: true,
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
      orderBy: { completedAt: 'desc' },
    });
  }

  // Get all users' test history (for admin)
  async getAllUsersTestHistory() {
    return this.prisma.testSet.findMany({
      where: {
        status: 'completed',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        part: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  // Get specific user's test history (for admin)
  async getSpecificUserTestHistory(
    targetUserId: number,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const testHistory =
      await this.prisma.testSet.findMany({
        where: {
          userId: targetUserId,
          status: 'completed',
        },
        include: {
          part: true,
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
        orderBy: { completedAt: 'desc' },
      });

    return {
      user,
      testHistory,
      statistics: await this.getUserStatistics(
        targetUserId,
      ),
    };
  }

  // Get user statistics
  async getUserStatistics(userId: number) {
    const completedTests =
      await this.prisma.testSet.count({
        where: {
          userId,
          status: 'completed',
        },
      });

    const averageScore =
      await this.prisma.testSet.aggregate({
        where: {
          userId,
          status: 'completed',
        },
        _avg: {
          totalScore: true,
        },
      });

    const bestScore =
      await this.prisma.testSet.aggregate({
        where: {
          userId,
          status: 'completed',
        },
        _max: {
          totalScore: true,
        },
      });

    const partStats =
      await this.prisma.testSet.groupBy({
        by: ['partId'],
        where: {
          userId,
          status: 'completed',
        },
        _count: {
          id: true,
        },
        _avg: {
          totalScore: true,
        },
        _max: {
          totalScore: true,
        },
      });

    const partStatsWithNames = await Promise.all(
      partStats.map(async (stat) => {
        const part =
          await this.prisma.part.findUnique({
            where: { id: stat.partId },
            select: {
              name: true,
              partNumber: true,
            },
          });
        return {
          ...stat,
          part,
        };
      }),
    );

    return {
      completedTests,
      averageScore:
        averageScore._avg.totalScore || 0,
      bestScore: bestScore._max.totalScore || 0,
      partStatistics: partStatsWithNames,
    };
  }

  // Get test set details with answers (for review)
  async getTestSetWithAnswers(
    testSetId: number,
    userId?: number,
  ) {
    const whereClause: any = { id: testSetId };
    if (userId) {
      whereClause.userId = userId;
    }

    const testSet =
      await this.prisma.testSet.findFirst({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          part: true,
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                  part: true,
                },
              },
            },
            orderBy: { orderIndex: 'asc' },
          },
          answers: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });

    if (!testSet) {
      throw new NotFoundException(
        'Test set not found',
      );
    }

    // Add correct answer info and user's answer to each question
    const questionsWithAnswers =
      testSet.questions.map((tq) => {
        const userAnswer = testSet.answers.find(
          (ans) =>
            ans.questionId === tq.questionId,
        );
        const correctOption =
          tq.question.options.find(
            (opt) => opt.isCorrect,
          );

        return {
          ...tq,
          userAnswer: userAnswer
            ? {
                selectedOption:
                  userAnswer.selectedOption,
                isCorrect: userAnswer.isCorrect,
                timeSpent: userAnswer.timeSpent,
              }
            : null,
          correctAnswer:
            correctOption?.optionLetter,
        };
      });

    return {
      ...testSet,
      questions: questionsWithAnswers,
    };
  }
}
