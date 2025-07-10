import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { Webhook } from './webhook.entity';
import { Task } from '../tasks/task.entity'
import { NotificationWebhookCron } from './cron/notification.webhook.cron';
import { TasksService } from '../tasks/tasks.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, TasksService, NotificationWebhookCron],
  imports: [TypeOrmModule.forFeature([Webhook, Task])],
})
export class WebhookModule {}
