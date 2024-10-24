import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Comment } from '@comment/entities/comment.entity';
import { User } from '@user/entities/user.entity';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // 댓글 작성하는 로직
  async createComment(
    user: User,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const newComment: Comment = await this.commentRepository.create({
      ...createCommentDto,
      user,
    });
    await this.commentRepository.save(newComment);
    return newComment;
  }

  // 공지에 달린 댓글 조회하는 로직
  async getCommentsByNoticeId(
    // user: User,
    noticeId: string,
  ): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { notice: { id: noticeId } },
      relations: ['notice', 'user'],
    });
  }

  // 공지 수정하는 로직(댓글 작성자만)
  async updateCommentById(
    user: User,
    commentId: string,
    updateCommentDto: CreateCommentDto,
  ): Promise<string> {
    const existedComment: Comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['notice', 'user'],
    });
    if (user.id !== existedComment.user.id)
      throw new HttpException(
        '당신이 작성한 댓글이 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    const comment: UpdateResult = await this.commentRepository.update(
      commentId,
      updateCommentDto,
    );
    if (comment.affected) return 'updated';
  }

  // 공지 삭제하는 로직(댓글 작성자만)
  async deleteCommentById(user: User, commentId: string): Promise<string> {
    const existedComment: Comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['notice', 'user'],
    });
    if (user.id !== existedComment.user.id)
      throw new HttpException(
        '당신이 작성한 댓글이 아닙니다.',
        HttpStatus.CONFLICT,
      );
    const result: DeleteResult = await this.commentRepository.delete({
      id: commentId,
    });
    if (result.affected) return 'delete successfully';
  }
}
