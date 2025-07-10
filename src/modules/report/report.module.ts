import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TasksService } from '../tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../modules/tasks/task.entity';

@Module({
  controllers: [ReportController],
  providers: [ReportService, TasksService],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class ReportModule {}
