import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Course } from './course.entity.js';
import { COURSE_STORE, CourseStore } from './store/course-store.js';
import { CreditService } from './credit.service.js';
import { AppLogger } from '../common/logger/app.logger.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { QueryCourseDto } from './dto/query-course.dto.js';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_STORE) private readonly courseStore: CourseStore,
    private readonly creditService: CreditService,
    private readonly logger: AppLogger,
  ) {}

  async findAll(query?: QueryCourseDto): Promise<Course[]> {
    let courses = await this.courseStore.readAll();

    if (query) {
      if (query.search) {
        const term = query.search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.code.toLowerCase().includes(term) ||
            c.title.toLowerCase().includes(term) ||
            c.instructor.toLowerCase().includes(term) ||
            (c.description && c.description.toLowerCase().includes(term)),
        );
      }

      if (query.department) {
        courses = courses.filter((c) => c.department === query.department);
      }

      if (query.minCredits !== undefined) {
        courses = courses.filter((c) => c.creditHours >= query.minCredits!);
      }

      if (query.sort === 'creditHours') {
        const order = query.order === 'desc' ? -1 : 1;
        courses = courses.slice().sort((a, b) => (a.creditHours - b.creditHours) * order);
      }

      if (query.limit !== undefined) {
        courses = courses.slice(0, query.limit);
      }
    }

    return courses;
  }

  async findByCode(code: string): Promise<Course> {
    const courses = await this.courseStore.readAll();
    const course = courses.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!course) {
      throw new NotFoundException(`Course with code ${code} not found`);
    }
    return course;
  }

  async getStats() {
    const courses = await this.courseStore.readAll();
    const totalCourses = courses.length;
    const totalCredits = this.creditService.totalCredits(courses);
    const overloaded = this.creditService.isOverloaded(totalCredits);

    return {
      totalCourses,
      totalCredits,
      overloaded,
    };
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const courses = await this.courseStore.readAll();
    const existing = courses.find(
      (c) => c.code.toUpperCase() === createCourseDto.code.toUpperCase(),
    );
    if (existing) {
      throw new ConflictException(`Course with code ${createCourseDto.code} already exists`);
    }

    const newCourse: Course = {
      ...createCourseDto,
    };

    courses.push(newCourse);
    await this.courseStore.writeAll(courses);
    this.logger.log(`Created course ${newCourse.code}`);
    return newCourse;
  }

  async update(code: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const courses = await this.courseStore.readAll();
    const index = courses.findIndex(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
    );
    if (index === -1) {
      throw new NotFoundException(`Course with code ${code} not found`);
    }

    const updatedCourse: Course = {
      ...courses[index],
      ...updateCourseDto,
    };

    courses[index] = updatedCourse;
    await this.courseStore.writeAll(courses);
    return updatedCourse;
  }

  async delete(code: string): Promise<void> {
    const courses = await this.courseStore.readAll();
    const index = courses.findIndex(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
    );
    if (index === -1) {
      throw new NotFoundException(`Course with code ${code} not found`);
    }

    const removed = courses.splice(index, 1)[0];
    await this.courseStore.writeAll(courses);
    this.logger.log(`Deleted course ${removed.code}`);
  }
}
