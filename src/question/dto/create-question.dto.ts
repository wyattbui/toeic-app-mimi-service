import { IsString, IsOptional, IsInt, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOptionDto {
  @IsString()
  optionLetter: string; // "A", "B", "C", "D"

  @IsString()
  optionText: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @IsInt()
  partId: number;

  @IsString()
  questionText: string;

  @IsString()
  questionType: string; // "single", "multiple", "passage"

  @IsString()
  difficulty: string; // "easy", "medium", "hard"

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  passageText?: string;

  @IsOptional()
  @IsString()
  passageTitle?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
