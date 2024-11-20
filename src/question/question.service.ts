import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@question/entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '@question/dto/create-question.dto';
import { BufferedFile } from '@minio-client/file.model';
import { MinioClientService } from '@minio-client/minio-client.service';
import { UpdateQuestionDto } from '@question/dto/update-question.dto';
import { EmailService } from '@email/email.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private readonly minioClientService: MinioClientService,
    private readonly emailService: EmailService,
  ) {}

  // 대관 문의 생성하는 로직
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    referenceFile?: BufferedFile,
  ): Promise<Question> {
    const newQuestion: Question =
      await this.questionRepository.create(createQuestionDto);
    await this.questionRepository.save(newQuestion);
    const questionReference: string =
      await this.minioClientService.uploadReferenceFile(
        newQuestion.id,
        referenceFile,
        'question',
      );
    newQuestion.document = questionReference;
    await this.questionRepository.save(newQuestion);
    return newQuestion;
  }

  // 대관 문의 상세 확인하는 로직
  async getQuestionById(id: string): Promise<Question> {
    const question: Question = await this.questionRepository.findOneBy({ id });
    if (!question)
      throw new HttpException('question is not exist', HttpStatus.NOT_FOUND);
    return question;
  }

  // 대관 문의 승인하는 로직
  async updateQuestionById(id: string, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.update(
      id,
      updateQuestionDto,
    );
    if (question.affected) {
      // await this.emailService.sendMail({
      //   to: question.email,
      //   subject: '[엘리스Lab] 대관 신청 완료',
      //   text: `엘리스Lab 대관 신청이 완료되었습니다.`,
      // });
      return `${id} is updated`;
    }
    throw new HttpException(
      `Question(id: ${id}) is not exist`,
      HttpStatus.NOT_FOUND,
    );
  }

  // 대관 문의 삭제하는 로직
  async deleteQuestionById(id: string) {
    const result = await this.questionRepository.delete({ id });
    if (result.affected) return `Question(id: ${id}) is deleted successfully`;
    throw new HttpException(
      `Question(id: ${id}) is not exist`,
      HttpStatus.NOT_FOUND,
    );
  }
}
