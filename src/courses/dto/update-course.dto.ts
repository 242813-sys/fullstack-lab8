import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto.js';

export class UpdateCourseDto extends PartialType(
  OmitType(CreateCourseDto, ['code'] as const),
) {}
