import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @ApiOperation({
    summary: 'List all reports',
    description: 'Returns all used car reports in the system.',
  })
  @Get()
  @Serialize(ReportDto)
  getReports() {
    return this.reportsService.findAll();
  }

  @ApiOperation({
    summary: 'Get price estimate',
    description:
      'Returns an estimated price based on similar approved reports (same make/model, similar location, year, mileage).',
  })
  @Get('/estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @ApiOperation({
    summary: 'Create report',
    description: 'Creates a new used car report. Requires authentication.',
  })
  @ApiCookieAuth('express:sess')
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @ApiOperation({
    summary: 'Approve or reject report',
    description: 'Approves or rejects a report. Admin only. Approved reports are used for estimates.',
  })
  @ApiCookieAuth('express:sess')
  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
