import { Module } from '@nestjs/common';
import { FeesController } from './fees.controller.js';
import { FeesInfoController, FEE_CALCULATOR } from './fees-info.controller.js';
import { FeesService, FEE_RATE } from './fees.service.js';
import { FEE_POLICY } from './fee-policy.interface.js';
import { StandardFeePolicy } from './policies/standard-fee.policy.js';
import { MeritFeePolicy } from './policies/merit-fee.policy.js';
import { StudentsModule } from '../students/students.module.js';
import { AppLogger } from '../common/logger/app.logger.js';

@Module({
  imports: [StudentsModule],
  controllers: [FeesInfoController, FeesController],
  providers: [
    FeesService,
    {
      provide: FEE_RATE,
      useValue: 5000,
    },
    {
      provide: FEE_POLICY,
      useFactory: (rate: number, logger: AppLogger) => {
        const policyEnv = (process.env.FEE_POLICY || 'standard').toLowerCase();
        if (policyEnv === 'merit') {
          logger.log('Active fee policy: merit');
          return new MeritFeePolicy();
        } else {
          logger.log('Active fee policy: standard');
          return new StandardFeePolicy();
        }
      },
      inject: [FEE_RATE, AppLogger],
    },
    {
      provide: FEE_CALCULATOR,
      useExisting: FeesService,
    },
  ],
  exports: [FeesService, FEE_POLICY, FEE_RATE, FEE_CALCULATOR],
})
export class FeesModule {}
