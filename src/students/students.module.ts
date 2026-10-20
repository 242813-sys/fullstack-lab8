import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { STUDENT_STORE, InMemoryStudentStore, JsonFileStudentStore } from './store/student-store.js';
import { APP_CONFIG, AppConfig } from '../common/config/app.config.js';
import { AppLogger } from '../common/logger/app.logger.js';
import { Student } from './student.entity.js';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  controllers: [StudentsController],
  providers: [
    StudentsService,
    {
      provide: STUDENT_STORE,
      useFactory: (config: AppConfig, logger: AppLogger) => {
        const storage = config?.storage || process.env.STORAGE || 'file';
        if (storage === 'memory') {
          logger.log('Students using memory storage');
          let initialStudents: Student[] = [];
          const filePath = path.resolve(process.cwd(), 'data', 'students.json');
          try {
            if (fs.existsSync(filePath)) {
              initialStudents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
          } catch {}
          return new InMemoryStudentStore(initialStudents);
        } else {
          logger.log('Students using file storage');
          return new JsonFileStudentStore();
        }
      },
      inject: [APP_CONFIG, AppLogger],
    },
  ],
  exports: [StudentsService, STUDENT_STORE],
})
export class StudentsModule {}
