import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';

@Module({
  providers: [TasksService],
  controllers: [TasksController],
  imports: [TypeOrmModule.forFeature([Task])],
  exports: [TasksService],
})
export class TasksModule {}
