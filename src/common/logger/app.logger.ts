import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logDir = path.resolve(process.cwd(), 'logs');
  private readonly logFilePath = path.join(this.logDir, 'app.log');

  log(message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${message}`;
    console.log(formatted);

    if (process.env.LOG_TO_FILE === 'true') {
      try {
        if (!fs.existsSync(this.logDir)) {
          fs.mkdirSync(this.logDir, { recursive: true });
        }
        fs.appendFileSync(this.logFilePath, formatted + '\n', 'utf8');
      } catch (err) {
        console.error('Failed to write to logs/app.log:', err);
      }
    }
  }

  error(message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ERROR: ${message}`;
    console.error(formatted);

    if (process.env.LOG_TO_FILE === 'true') {
      try {
        if (!fs.existsSync(this.logDir)) {
          fs.mkdirSync(this.logDir, { recursive: true });
        }
        fs.appendFileSync(this.logFilePath, formatted + '\n', 'utf8');
      } catch {}
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] WARN: ${message}`;
    console.warn(formatted);
  }
}
