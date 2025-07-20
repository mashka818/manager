import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The text content of the comment' })
  @IsString()
  @IsNotEmpty()
  text: string;
} 