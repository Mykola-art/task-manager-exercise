import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '../../common/enums';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the task' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Title of the task' })
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Description of the task', required: false })
  description?: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: 'Due date of the task in ISO-8601 format' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.OPEN,
  })
  @ApiProperty({
    description: 'Status of the task',
    required: false,
    enum: TaskStatusEnum,
  })
  status: TaskStatusEnum;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiProperty({
    description: 'Indicates if the task has been notified',
    required: false,
  })
  isNotified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description: 'Timestamp when the task was deleted',
    required: false,
  })
  deleted_at?: Date;
}
