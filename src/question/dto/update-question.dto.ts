import { IsString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from './create-question.dto';

export class UpdateQuestionDto {
  @IsOptional()
  @IsInt()
  partId?: number;

  @IsOptional()
  @IsString()
  questionText?: string;

  @IsOptional()
  @IsString()
  questionType?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
