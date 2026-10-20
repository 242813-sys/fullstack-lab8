import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import { StudentsModule } from './students/students.module.js';
import { CoursesModule } from './courses/courses.module.js';
import { FeesModule } from './fees/fees.module.js';

@Module({
  imports: [
    CommonModule,
    StudentsModule,
    CoursesModule,
    FeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
