import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

   // ✅ NEW: list all reports
  findAll() {
    return this.repo.find();
  }

  async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
  // pick top 3 closest rows (no aggregation here)
  const subQuery = this.repo
    .createQueryBuilder('report')
    .select('report.price', 'price')
    .where('report.make = :make', { make })
    .andWhere('report.model = :model', { model })
    .andWhere('report.lng - :lng BETWEEN -5 AND 5', { lng })
    .andWhere('report.lat - :lat BETWEEN -5 AND 5', { lat })
    .andWhere('report.year - :year BETWEEN -3 AND 3', { year })
    .andWhere('report.approved IS TRUE')
    .orderBy('ABS(report.mileage - :mileage)', 'ASC')
    .setParameters({ mileage })
    .limit(3);

  // average those 3 prices
  return this.repo.manager
    .createQueryBuilder()
    .select('AVG(price)', 'price')
    .from('(' + subQuery.getQuery() + ')', 'matched_reports')
    .setParameters(subQuery.getParameters())
    .getRawOne();
}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
