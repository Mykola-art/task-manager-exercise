import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './dtos';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post()
  @ApiOperation({ summary: 'Register webhook URL for due date notifications' })
  @ApiResponse({
    status: 201,
    description: 'Webhook registration confirmation',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async registerWebhook(@Body() webhookDto: WebhookDto): Promise<string> {
    await this.webhookService.registerWebhook(webhookDto);
    return `Webhook URL ${webhookDto.url} has been registered successfully.`;
  }
}
