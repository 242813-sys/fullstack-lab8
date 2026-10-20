import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeesService } from './fees.service.js';
import { FeeQueryDto } from './dto/fee-query.dto.js';

@Controller('api/fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get(':rollNumber')
  getFee(
    @Param('rollNumber') rollNumber: string,
    @Query() query: FeeQueryDto,
  ) {
    return this.feesService.calculateFee(rollNumber, query.creditHours);
  }
}
