import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createComment(
    taskId: string,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      task,
      taskId,
      author: user,
      authorId: user.id,
    });

    return this.commentRepository.save(comment);
  }

  async getTaskComments(taskId: string): Promise<Comment[]> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.commentRepository.find({
      where: { taskId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
} 