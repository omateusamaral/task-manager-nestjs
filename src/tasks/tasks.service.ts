import { Injectable } from '@nestjs/common';
import { TaskInterface, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: TaskInterface[] = [];

  getAllTasks(): TaskInterface[] {
    return this.tasks;
  }
  createTask(createTaskDto: CreateTaskDto): TaskInterface {
    const { title, description } = createTaskDto;
    const task: TaskInterface = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  getTaskById(id: string): TaskInterface {
    return this.tasks.find((task) => task.id === id);
  }
}
