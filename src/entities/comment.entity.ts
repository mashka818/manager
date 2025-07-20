import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, task => task.comments)
  task: Task;

  @Column()
  taskId: string;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @Column()
  authorId: string;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;
} 