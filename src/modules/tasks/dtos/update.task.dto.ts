import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './ceate.task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
