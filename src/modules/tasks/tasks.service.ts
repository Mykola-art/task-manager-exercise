import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dtos';
import { GroupTaskByStatusInterface } from '../../common/interfaces';
import { TaskStatusEnum } from '../../common/enums';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = await this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(newTask);
  }

  async getAllTasks(
    limit?: number,
    offset?: number,
  ): Promise<{ tasks: Task[]; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      take: limit || 20,
      skip: offset || 0,
      where: {
        deleted_at: IsNull(),
      },
    });

    return { tasks, total };
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async softDeleteTask(id: number): Promise<string> {
    const task = await this.getTaskById(id);

    task.deleted_at = new Date();

    await this.taskRepository.save(task);

    return `Task with ID ${id} has been marked as deleted.`;
  }

  async getGroupTasksByStatus(): Promise<GroupTaskByStatusInterface[]> {
    const result = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.status')
      .addSelect('COUNT(task.id)', 'count')
      .groupBy('task.status')
      .where('task.deleted_at IS NULL')
      .getRawMany();

    return result;
  }

  async checkDueDates(): Promise<Task[]> {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now);
    twentyFourHoursFromNow.setHours(now.getHours() + 24);

    return this.taskRepository.find({
      where: {
        deleted_at: IsNull(),
        dueDate: LessThanOrEqual(twentyFourHoursFromNow),
        status: Not(TaskStatusEnum.DONE),
        isNotified: false,
      },
    });
  }

  async updateIsNotified(taskIds: number[]): Promise<void> {
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ isNotified: true })
      .where('id IN (:...ids)', { ids: taskIds })
      .execute();
  }
}
