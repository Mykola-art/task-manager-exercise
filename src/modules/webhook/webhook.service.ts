import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Webhook } from './webhook.entity';
import { Task } from '../tasks/task.entity'
import { WebhookDto } from './dtos';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>,
  ) {}

  async registerWebhook(webhookDto: WebhookDto): Promise<Webhook> {
    const webhook = this.webhookRepository.create({
      url: webhookDto.url,
    });

    return this.webhookRepository.save(webhook);
  }

  async findAll(): Promise<Webhook[]> {
    return this.webhookRepository.find();
  }

  async sendDueDateNotification(payload: Task, url: string): Promise<void> {
    try {
      await axios.post(
        url,
        `Task ${payload.title} with status ${payload.status} expire at ${payload.dueDate}`,
      );
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
