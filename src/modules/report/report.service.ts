import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { TransformReportData } from '../../common/utils/transform.report.data';
import { ReportResponseInterface } from '../../common/interfaces';

@Injectable()
export class ReportService {
  constructor(private readonly taskService: TasksService) {}

  async getTaskReport(): Promise<ReportResponseInterface> {
    const data = await this.taskService.getGroupTasksByStatus();
    return TransformReportData(data);
  }
}
