import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '../../tasks/tasks.service';
import { WebhookService } from '../webhook.service';

@Injectable()
export class NotificationWebhookCron {
  constructor(
    private readonly tasksService: TasksService,
    private readonly webhookService: WebhookService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleDueDateNotifications(): Promise<void> {
    console.log('Checking for tasks approaching their due date...');
    const tasks = await this.tasksService.checkDueDates();
    if (tasks.length) {
      const webhooks = await this.webhookService.findAll();

      try {
        console.log(`Found ${tasks.length} tasks approaching their due date.`);
        console.log(`Found ${webhooks.length} registered webhooks.`);

        const notificationPromises = tasks.map((task) =>
          Promise.all(
            webhooks.map((webhook) =>
              this.webhookService.sendDueDateNotification(task, webhook.url),
            ),
          ),
        );

        await Promise.all(notificationPromises);

        await this.bulkUpdateIsNotified(tasks);
        console.log('All notifications have been sent.');
      } catch (error) {
        console.error('Error during due date notification processing:', error);
      }
    }
  }

  private async bulkUpdateIsNotified(tasks: any[]): Promise<void> {
    const taskIds = tasks.map((task) => task.id);

    if (taskIds.length > 0) {
      try {
        await this.tasksService.updateIsNotified(taskIds);
      } catch (error) {
        console.error('Error during bulk update of isNotified:', error);
      }
    }
  }
}
