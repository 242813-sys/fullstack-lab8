import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FEE_POLICY, FeePolicy } from './fee-policy.interface.js';
import { StudentsService } from '../students/students.service.js';

export const FEE_RATE = 'FEE_RATE';

@Injectable()
export class FeesService {
  constructor(
    @Inject(FEE_POLICY) private readonly feePolicy: FeePolicy,
    @Inject(FEE_RATE) private readonly ratePerCreditHour: number,
    private readonly studentsService: StudentsService,
  ) {}

  async calculateFee(rollNumber: string, creditHours: number) {
    const student = await this.studentsService.findByRollNumber(rollNumber);
    if (!student) {
      throw new NotFoundException(`Student with roll number ${rollNumber} not found`);
    }

    const total = this.feePolicy.calculate(
      creditHours,
      student.cgpa,
      this.ratePerCreditHour,
    );

    return {
      rollNumber: student.rollNumber,
      name: student.name,
      cgpa: student.cgpa,
      creditHours,
      policy: this.feePolicy.name,
      ratePerCreditHour: this.ratePerCreditHour,
      total,
    };
  }

  getInfo() {
    return {
      policy: this.feePolicy.name,
      ratePerCreditHour: this.ratePerCreditHour,
    };
  }
}
