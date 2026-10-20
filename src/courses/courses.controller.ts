import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { QueryCourseDto } from './dto/query-course.dto.js';
import { CodeParamDto } from './dto/code-param.dto.js';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query() query: QueryCourseDto) {
    return this.coursesService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.coursesService.getStats();
  }

  @Get(':code')
  findOne(@Param() params: CodeParamDto) {
    return this.coursesService.findByCode(params.code);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':code')
  updatePut(@Param() params: CodeParamDto, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(params.code, updateCourseDto);
  }

  @Patch(':code')
  updatePatch(@Param() params: CodeParamDto, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(params.code, updateCourseDto);
  }

  @Delete(':code')
  @HttpCode(204)
  async remove(@Param() params: CodeParamDto) {
    await this.coursesService.delete(params.code);
  }
}
