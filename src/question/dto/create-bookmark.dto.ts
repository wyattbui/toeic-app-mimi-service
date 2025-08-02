import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateBookmarkDto {
  @IsInt()
  questionId: number;

  @IsOptional()
  @IsString()
  note?: string;
}
