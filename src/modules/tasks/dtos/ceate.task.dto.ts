import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { TaskStatusEnum } from '../../../common/enums';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title cannot be longer than 255 characters' })
  title: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'Description cannot be longer than 1000 characters',
  })
  description?: string;

  @ApiProperty({ description: 'Due date of the task in ISO-8601 format' })
  @IsDateString()
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate: string;

  @ApiProperty({
    description: 'Status of the task',
    required: false,
    enum: TaskStatusEnum,
    enumName: 'TaskStatusEnum',
  })
  @IsOptional()
  @IsEnum(TaskStatusEnum, {
    message: 'Status must be one of: OPEN, IN_PROGRESS, DONE',
  })
  status?: TaskStatusEnum;
}
