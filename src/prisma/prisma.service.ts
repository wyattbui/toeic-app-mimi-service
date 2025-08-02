import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async cleanDb() {
    await this.$transaction([
      this.userAnswer.deleteMany(),
      this.option.deleteMany(),
      this.question.deleteMany(),
      this.testResult.deleteMany(),
      this.part.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
