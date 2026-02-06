import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 'ford', description: 'Car manufacturer' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'mustang', description: 'Car model' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2020, minimum: 1930, maximum: 2050, description: 'Year of manufacture' })
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ApiProperty({ example: 50000, minimum: 0, maximum: 1000000, description: 'Vehicle mileage' })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @ApiProperty({ example: -73.935242, description: 'Longitude of vehicle location' })
  @IsLongitude()
  lng: number;

  @ApiProperty({ example: 40.73061, description: 'Latitude of vehicle location' })
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 25000, minimum: 0, maximum: 1000000, description: 'Asking price' })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
