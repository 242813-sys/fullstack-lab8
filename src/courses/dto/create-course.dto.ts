import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
  MaxLength,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Department } from '../../students/student.entity.js';

export class CreateCourseDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code is required' })
  @Matches(/^CS-\d{3}L?$/, { message: 'code must look like CS-301 or CS-301L' })
  code: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  title: string;

  @IsInt({ message: 'creditHours must be an integer' })
  @Min(1, { message: 'creditHours must be at least 1' })
  @Max(4, { message: 'creditHours must be at most 4' })
  creditHours: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'instructor must be a string' })
  @IsNotEmpty({ message: 'instructor is required' })
  @MinLength(3, { message: 'instructor must be at least 3 characters' })
  instructor: string;

  @IsEnum(Department, { message: 'department must be a valid Department' })
  department: Department;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'description must be a string' })
  @MaxLength(200, { message: 'description must be at most 200 characters' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'tags must be an array' })
  @ArrayMaxSize(5, { message: 'tags cannot contain more than 5 items' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((tag) => (typeof tag === 'string' ? tag.trim().toLowerCase() : tag))
      : value,
  )
  @IsString({ each: true, message: 'each tag must be a string' })
  tags?: string[];
}
