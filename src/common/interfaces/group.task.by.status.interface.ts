import { TaskStatusEnum } from '../enums';

export interface GroupTaskByStatusInterface {
  task_status: TaskStatusEnum | string;
  count: string;
}
