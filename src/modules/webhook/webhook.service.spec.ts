import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Webhook } from './webhook.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Task } from '../tasks/task.entity';
import { WebhookDto } from './dtos';
import { TaskStatusEnum } from '../../common/enums';

jest.mock('axios');

describe('WebhookService', () => {
	let service: WebhookService;
	let webhookRepository: Repository<Webhook>;

	const mockWebhookRepository = {
		create: jest.fn().mockReturnValue({}),
		save: jest.fn().mockResolvedValue({}),
		find: jest.fn().mockResolvedValue([
			{ id: 1, url: 'http://example.com/webhook1' },
			{ id: 2, url: 'http://example.com/webhook2' },
		]),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WebhookService,
				{
					provide: getRepositoryToken(Webhook),
					useValue: mockWebhookRepository,
				},
			],
		}).compile();

		service = module.get<WebhookService>(WebhookService);
		webhookRepository = module.get<Repository<Webhook>>(getRepositoryToken(Webhook));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should register a new webhook', async () => {
		const webhookDto: WebhookDto = { url: 'http://example.com/webhook' };
		await service.registerWebhook(webhookDto);

		expect(mockWebhookRepository.create).toHaveBeenCalledWith({
			url: webhookDto.url,
		});
		expect(mockWebhookRepository.save).toHaveBeenCalled();
	});

	it('should find all webhooks', async () => {
		const result = await service.findAll();
		expect(result).toHaveLength(2);
		expect(result[0].url).toBe('http://example.com/webhook1');
	});

	it('should send a due date notification', async () => {
		const payload: Task = {
			id: 1,
			title: 'Test Task',
			dueDate: new Date(),
			status: TaskStatusEnum.OPEN,
			isNotified: false,
			deleted_at: undefined, 
		};

		const webhookUrl = 'http://example.com/webhook';
		
		(axios.post as jest.Mock).mockResolvedValue({});

		await service.sendDueDateNotification(payload, webhookUrl);

		expect(axios.post).toHaveBeenCalledWith(
			webhookUrl,
			`Task ${payload.title} with status ${payload.status} expire at ${payload.dueDate}`,
		);
		expect(axios.post).toHaveBeenCalledTimes(1);
	});

	it('should handle error when sending due date notification', async () => {
		const payload: Task = {
			id: 1,
			title: 'Test Task',
			dueDate: new Date(), 
			status: TaskStatusEnum.OPEN, 
			isNotified: false,
			deleted_at: undefined, 
		};

		const webhookUrl = 'http://example.com/webhook';

		(axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

		await service.sendDueDateNotification(payload, webhookUrl);

		expect(axios.post).toHaveBeenCalledWith(
			webhookUrl,
			`Task ${payload.title} with status ${payload.status} expire at ${payload.dueDate}`,
		);
		expect(axios.post).toHaveBeenCalledTimes(1);
	});
});
