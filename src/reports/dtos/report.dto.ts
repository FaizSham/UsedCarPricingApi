import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 25000 })
  @Expose()
  price: number;

  @ApiProperty({ example: 2020 })
  @Expose()
  year: number;

  @ApiProperty({ example: -73.935242 })
  @Expose()
  lng: number;

  @ApiProperty({ example: 40.73061 })
  @Expose()
  lat: number;

  @ApiProperty({ example: 'ford' })
  @Expose()
  make: string;

  @ApiProperty({ example: 'mustang' })
  @Expose()
  model: string;

  @ApiProperty({ example: 50000 })
  @Expose()
  mileage: number;

  @ApiProperty({ example: false })
  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  @ApiProperty({ example: 4 })
  userId: number;
}
