import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Department } from '../../students/student.entity.js';

export class QueryCourseDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(Department, { message: 'department must be a valid Department' })
  department?: Department;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'minCredits must be an integer' })
  @Min(1, { message: 'minCredits must be at least 1' })
  @Max(4, { message: 'minCredits must be at most 4' })
  minCredits?: number;

  @IsOptional()
  @IsIn(['creditHours'], { message: 'sort must be creditHours' })
  sort?: 'creditHours';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order must be asc or desc' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(50, { message: 'limit must be at most 50' })
  limit?: number;
}
