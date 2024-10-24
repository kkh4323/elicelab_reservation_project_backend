import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CommentService } from '@comment/comment.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { Comment } from '@comment/entities/comment.entity';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req: RequestWithUserInterface,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentService.createComment(req.user, createCommentDto);
  }

  @Get('/:noticeId')
  async getCommentsByNoticeId(
    @Param('noticeId') noticeId: string,
  ): Promise<Comment[]> {
    return await this.commentService.getCommentsByNoticeId(noticeId);
  }

  @Put('/:commentId')
  @UseGuards(JwtAuthGuard)
  async updateCommentById(
    @Req() req: RequestWithUserInterface,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CreateCommentDto,
  ): Promise<string> {
    return await this.commentService.updateCommentById(
      req.user,
      commentId,
      updateCommentDto,
    );
  }

  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteCommentById(
    @Req() req: RequestWithUserInterface,
    @Param('commentId') commentId: string,
  ): Promise<string> {
    return await this.commentService.deleteCommentById(req.user, commentId);
  }
}
