import { Controller, Get, Inject } from '@nestjs/common';
import { FeesService } from './fees.service.js';

export const FEE_CALCULATOR = 'FEE_CALCULATOR';

@Controller('api/fees')
export class FeesInfoController {
  constructor(
    @Inject(FEE_CALCULATOR) private readonly feeCalculator: FeesService,
  ) {}

  @Get('info')
  getInfo() {
    return this.feeCalculator.getInfo();
  }
}
