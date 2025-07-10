import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the webhook' })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ description: 'Unique url for the webhook' })
  url: string;
}
