import {Test, TestingModule} from '@nestjs/testing';
import {TasksService} from './tasks.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Task} from './task.entity';
import {Repository} from 'typeorm';
import {NotFoundException} from '@nestjs/common';
import {TaskStatusEnum} from "../../common/enums";

describe('TasksService', () => {
	let service: TasksService;
	let repository: Repository<Task>;

	const mockTaskRepository = {
		create: jest.fn().mockReturnValue({}),
		save: jest.fn().mockResolvedValue({}),
		findOneById: jest.fn().mockResolvedValue({
			id: 1,
			title: 'Test Task',
			description: 'Test Description',
			dueDate: new Date(),
			status: 'OPEN',
			isNotified: false,
			deleted_at: null,
		}),
		findAndCount: jest.fn().mockResolvedValue([[{ id: 1, title: 'Test Task' }], 1]),
		createQueryBuilder: jest.fn().mockReturnValue({
			select: jest.fn().mockReturnThis(),
			addSelect: jest.fn().mockReturnThis(),
			groupBy: jest.fn().mockReturnThis(),
			where: jest.fn().mockReturnThis(),
			getRawMany: jest.fn().mockResolvedValue([
				{ task_status: TaskStatusEnum.OPEN, count: 5 },
				{ task_status: TaskStatusEnum.IN_PROGRESS, count: 3 },
			]),
			update: jest.fn().mockReturnThis(), 
			set: jest.fn().mockReturnThis(),
			execute: jest.fn().mockResolvedValue(undefined),
		}),
		find: jest.fn().mockResolvedValue([{
			id: 1,
			title: 'Test Task',
			description: 'Test Description',
			dueDate: new Date(),
			status: TaskStatusEnum.OPEN,
			isNotified: false,
			deleted_at: null,
		}]),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: getRepositoryToken(Task),
					useValue: mockTaskRepository,
				},
			],
		}).compile();

		service = module.get<TasksService>(TasksService);
		repository = module.get<Repository<Task>>(getRepositoryToken(Task));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a new task', async () => {
		const createTaskDto = { title: 'New Task', dueDate: '2025-07-10T22:00:00Z' };
		await service.createTask(createTaskDto);
		expect(mockTaskRepository.save).toHaveBeenCalled();
	});

	it('should get all tasks', async () => {
		const result = await service.getAllTasks();
		expect(result.tasks).toHaveLength(1);
		expect(result.total).toBe(1);
	});

	it('should get a task by ID', async () => {
		const task = await service.getTaskById(1);
		expect(task).toBeDefined();
		expect(task.title).toBe('Test Task');
	});

	it('should throw NotFoundException if task not found', async () => {
		mockTaskRepository.findOneById.mockResolvedValueOnce(null);
		await expect(service.getTaskById(999)).rejects.toThrowError(NotFoundException);
	});

	it('should update a task', async () => {
		const updateTaskDto = { title: 'Updated Task' };
		const updatedTask = await service.updateTask(1, updateTaskDto);
		expect(mockTaskRepository.save).toHaveBeenCalled();
	});

	it('should soft delete a task', async () => {
		const result = await service.softDeleteTask(1);
		expect(result).toBe('Task with ID 1 has been marked as deleted.');
	});

	it('should get group tasks by status', async () => {
		const result = await service.getGroupTasksByStatus();
		
		expect(result).toHaveLength(2);
		expect(result[0].task_status).toBe(TaskStatusEnum.OPEN);
		expect(result[1].task_status).toBe(TaskStatusEnum.IN_PROGRESS);
	});

	it('should check due dates and return tasks', async () => {
		const result = await service.checkDueDates();
		expect(result).toBeDefined();
		expect(result).toHaveLength(1);
	});

	it('should update isNotified for tasks', async () => {
		const taskIds = [1, 2];
		await service.updateIsNotified(taskIds);
		expect(mockTaskRepository.createQueryBuilder().update).toHaveBeenCalled();
	});
});

