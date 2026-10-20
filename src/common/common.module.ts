import { Global, Module } from '@nestjs/common';
import { AppLogger } from './logger/app.logger.js';
import { APP_CONFIG, AppConfig } from './config/app.config.js';

@Global()
@Module({
  providers: [
    AppLogger,
    {
      provide: APP_CONFIG,
      useFactory: (): AppConfig => ({
        storage: process.env.STORAGE === 'memory' ? 'memory' : 'file',
        logToFile: process.env.LOG_TO_FILE === 'true',
      }),
    },
  ],
  exports: [AppLogger, APP_CONFIG],
})
export class CommonModule {}
