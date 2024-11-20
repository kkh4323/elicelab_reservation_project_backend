import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from '@question/question.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from '@question/dto/create-question.dto';
import { BufferedFile } from '@minio-client/file.model';
import { RoleGuard } from '@auth/guardies/role.guard';
import { Role } from '@user/entities/role.enum';
import { Question } from '@question/entities/question.entity';
import { UpdateQuestionDto } from '@question/dto/update-question.dto';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/create')
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFile() referenceFile?: BufferedFile,
  ): Promise<Question> {
    return await this.questionService.createQuestion(
      createQuestionDto,
      referenceFile,
    );
  }

  @Get()
  async getQuestions() {
    return;
  }

  @Get('/:id')
  async getQuestionById(@Param('id') id: string): Promise<Question> {
    return await this.questionService.getQuestionById(id);
  }

  @Put('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async updateQuestionById(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<string> {
    return await this.questionService.updateQuestionById(id, updateQuestionDto);
  }

  @Delete('/:id')
  async deleteQuestionById(@Param('id') id: string): Promise<string> {
    return await this.questionService.deleteQuestionById(id);
  }
}
