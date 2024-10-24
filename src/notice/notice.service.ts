import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from '@notice/entities/notice.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  // [관리자] 공지사항 생성하는 로직
  async createNotice(
    user: User,
    createNoticeDto: CreateNoticeDto,
  ): Promise<Notice> {
    const newNotice: Notice = await this.noticeRepository.create({
      ...createNoticeDto,
      user,
    });
    await this.noticeRepository.save(newNotice);
    return newNotice;
  }

  // 공지사항 데이터 전체 가져오는 로직
  async getNotices(): Promise<Notice[]> {
    return await this.noticeRepository.find({});
  }

  // 상세 공지사항 데이터 가져오는 로직
  async getNoticeById(id: string) {
    const notice: Notice = await this.noticeRepository.findOneBy({ id });
    if (!notice)
      throw new HttpException(
        'there is not exist notice.',
        HttpStatus.NOT_FOUND,
      );
    return notice;
  }

  // [관리자] 공지사항 데이터 수정하는 로직
  async updateNoticeById(id: string, updateNoticeDto: CreateNoticeDto) {
    const notice: UpdateResult = await this.noticeRepository.update(
      id,
      updateNoticeDto,
    );
    if (notice.affected) return 'updated';
  }

  // [관리자] 공지사항 데이터 삭제하는 로직
  async deleteNoticeById(id: string) {
    const result: DeleteResult = await this.noticeRepository.delete({ id });
    if (result.affected) return `${id} is deleted successfully`;
  }
}
