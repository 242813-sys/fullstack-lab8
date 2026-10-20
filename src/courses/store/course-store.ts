import { Course } from '../course.entity.js';
import * as fs from 'fs';
import * as path from 'path';

export const COURSE_STORE = Symbol('COURSE_STORE');

export interface CourseStore {
  readAll(): Promise<Course[]>;
  writeAll(courses: Course[]): Promise<void>;
}

export class InMemoryCourseStore implements CourseStore {
  private courses: Course[];

  constructor(initialCourses: Course[] = []) {
    this.courses = JSON.parse(JSON.stringify(initialCourses));
  }

  async readAll(): Promise<Course[]> {
    return JSON.parse(JSON.stringify(this.courses));
  }

  async writeAll(courses: Course[]): Promise<void> {
    this.courses = JSON.parse(JSON.stringify(courses));
  }
}

export class JsonFileCourseStore implements CourseStore {
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || path.resolve(process.cwd(), 'data', 'courses.json');
  }

  async readAll(): Promise<Course[]> {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeAll(courses: Course[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(this.filePath, JSON.stringify(courses, null, 2), 'utf8');
  }
}
