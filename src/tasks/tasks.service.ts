import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      creator: user,
      creatorId: user.id,
      status: TaskStatus.PENDING,
    });

    return this.taskRepository.save(task);
  }

  async getTasks(status?: TaskStatus): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    return query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ 
      where: { id },
      relations: ['creator'] 
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (task.creatorId !== user.id) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);

    if (task.creatorId !== user.id) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.taskRepository.remove(task);
  }
} 