import { Injectable } from '@nestjs/common';
import { Course } from './course.entity.js';

@Injectable()
export class CreditService {
  totalCredits(courses: Course[]): number {
    return courses.reduce((sum, course) => sum + (Number(course.creditHours) || 0), 0);
  }

  isOverloaded(totalCredits: number): boolean {
    return totalCredits > 18;
  }
}
