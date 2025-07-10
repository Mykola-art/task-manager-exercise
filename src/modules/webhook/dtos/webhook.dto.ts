import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class WebhookDto {
  @ApiProperty({ description: 'URL of the webhook to notify on due date' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
