import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { TasksService } from '../tasks/tasks.service';
import { TransformReportData } from '../../common/utils/transform.report.data';
import { ReportResponseInterface } from '../../common/interfaces';

jest.mock('../tasks/tasks.service');
jest.mock('../../common/utils/transform.report.data');

describe('ReportService', () => {
	let service: ReportService;
	let taskService: TasksService;

	const mockTaskService = {
		getGroupTasksByStatus: jest.fn(),
	};

	const mockTransformReportData = TransformReportData as jest.Mock;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReportService,
				{
					provide: TasksService,
					useValue: mockTaskService,
				},
			],
		}).compile();

		service = module.get<ReportService>(ReportService);
		taskService = module.get<TasksService>(TasksService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return a transformed task report', async () => {
		const taskGroupData = [
			{ task_status: 'OPEN', count: 5 },
			{ task_status: 'IN_PROGRESS', count: 3 },
		];
		
		mockTaskService.getGroupTasksByStatus.mockResolvedValue(taskGroupData);
		
		mockTransformReportData.mockReturnValue({
			OPEN: 5,
			IN_PROGRESS: 3,
		});
		
		const result = await service.getTaskReport();
		
		expect(taskService.getGroupTasksByStatus).toHaveBeenCalled();

		expect(mockTransformReportData).toHaveBeenCalledWith(taskGroupData);
		
		expect(result).toEqual({
			OPEN: 5,
			IN_PROGRESS: 3,
		});
	});

	it('should throw error if getGroupTasksByStatus fails', async () => {
		mockTaskService.getGroupTasksByStatus.mockRejectedValue(new Error('Database Error'));
		
		await expect(service.getTaskReport()).rejects.toThrowError('Database Error');
	});
});
