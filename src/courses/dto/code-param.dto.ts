import { Matches, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CodeParamDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code is required' })
  @Matches(/^CS-\d{3}L?$/, { message: 'code must look like CS-301 or CS-301L' })
  code: string;
}
