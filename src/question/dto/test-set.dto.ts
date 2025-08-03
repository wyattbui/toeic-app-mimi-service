import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateTestSetDto {
  @IsInt()
  partId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  questionCount?: number = 20;

  @IsOptional()
  @IsInt()
  timeLimit?: number = 60; // minutes

  @IsOptional()
  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: string;
}

export class SubmitTestSetDto {
  @IsInt()
  testSetId: number;

  answers: TestSetAnswerDto[];
}

export class TestSetAnswerDto {
  @IsInt()
  questionId: number;

  @IsOptional()
  @IsString()
  @IsIn(['A', 'B', 'C', 'D'])
  selectedOption?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number; // seconds
}
