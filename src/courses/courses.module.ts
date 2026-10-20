import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { CreditService } from './credit.service.js';
import { COURSE_STORE, InMemoryCourseStore, JsonFileCourseStore } from './store/course-store.js';
import { APP_CONFIG, AppConfig } from '../common/config/app.config.js';
import { AppLogger } from '../common/logger/app.logger.js';
import { Course } from './course.entity.js';
import * as fs from 'fs';
import * as path from 'path';

export const courseStoreProvider = {
  provide: COURSE_STORE,
  useFactory: (config: AppConfig, logger: AppLogger) => {
    const storage = config?.storage || process.env.STORAGE || 'file';
    if (storage === 'memory') {
      logger.log('Using memory storage');
      let initialCourses: Course[] = [];
      const filePath = path.resolve(process.cwd(), 'data', 'courses.json');
      try {
        if (fs.existsSync(filePath)) {
          initialCourses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      } catch {}
      return new InMemoryCourseStore(initialCourses);
    } else {
      logger.log('Using file storage');
      return new JsonFileCourseStore();
    }
  },
  inject: [APP_CONFIG, AppLogger],
};

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CreditService,
    courseStoreProvider,
  ],
  exports: [CoursesService, CreditService, COURSE_STORE],
})
export class CoursesModule {}
