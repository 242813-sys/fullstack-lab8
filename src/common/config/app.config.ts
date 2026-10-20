export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  storage: 'file' | 'memory';
  logToFile: boolean;
}
