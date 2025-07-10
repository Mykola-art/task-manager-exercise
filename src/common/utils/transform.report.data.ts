import { TaskStatusEnum } from '../enums';
import {
  GroupTaskByStatusInterface,
  ReportResponseInterface,
} from '../interfaces';

export function TransformReportData(
  data: GroupTaskByStatusInterface[],
): ReportResponseInterface {
  const report: ReportResponseInterface = {
    OPEN: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };

  data.forEach((row) => {
    if (row.task_status === TaskStatusEnum.OPEN) {
      report.OPEN = parseInt(row.count, 10);
    }
    if (row.task_status === TaskStatusEnum.IN_PROGRESS) {
      report.IN_PROGRESS = parseInt(row.count, 10);
    }
    if (row.task_status === TaskStatusEnum.DONE) {
      report.DONE = parseInt(row.count, 10);
    }
  });

  return report;
}
