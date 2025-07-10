import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { ReportResponseInterface } from '../../common/interfaces';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Get()
  @ApiOperation({ summary: 'Get aggregate report of tasks by status' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the task report by status',
    schema: {
      example: {
        OPEN: 5,
        IN_PROGRESS: 3,
        DONE: 12,
      },
    },
  })
  async getTaskReport(): Promise<ReportResponseInterface> {
    return this.reportService.getTaskReport();
  }
}
