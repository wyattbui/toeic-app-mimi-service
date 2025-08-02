import { IsString, IsOptional, IsInt } from 'class-validator';

export class AnswerQuestionDto {
  @IsInt()
  questionId: number;

  @IsString()
  selectedOption: string; // "A", "B", "C", "D"

  @IsOptional()
  @IsInt()
  timeSpent?: number; // in seconds
}

export class SubmitTestDto {
  @IsString()
  testType: string; // "Full", "Part1-7", "Practice"

  @IsInt()
  duration: number; // in minutes

  answers: AnswerQuestionDto[];
}
