import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveReportDto {
  @ApiProperty({ example: true, description: 'true to approve, false to reject' })
  @IsBoolean()
  approved: boolean;
}
