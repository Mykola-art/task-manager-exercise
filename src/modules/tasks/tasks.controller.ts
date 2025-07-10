import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dtos';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been created',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tasks',
    type: Task,
    isArray: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of tasks to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of tasks to skip',
  })
  async getAllTasks(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<{ tasks: Task[]; total: number }> {
    return this.taskService.getAllTasks(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved task',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTaskById(@Param('id') id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiResponse({
    status: 200,
    description: 'Task successfully marked as deleted',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async softDeleteTask(@Param('id') id: number): Promise<string> {
    return this.taskService.softDeleteTask(id);
  }
}
