import { IsDefined, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FeeQueryDto {
  @IsDefined({ message: 'creditHours is required' })
  @Type(() => Number)
  @IsInt({ message: 'creditHours must be an integer' })
  @Min(1, { message: 'creditHours must be at least 1' })
  @Max(24, { message: 'creditHours must be at most 24' })
  creditHours: number;
}
