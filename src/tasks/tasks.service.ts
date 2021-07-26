import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskInterface, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: TaskInterface[] = [];

  getAllTasks(): TaskInterface[] {
    return this.tasks;
  }
  getTasksWithFIlters(filterDto: GetTasksFilterDto): TaskInterface[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
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
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  deleteTask(id: string): void {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  updateTaskStatus(id: string, status: TaskStatus): TaskInterface {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
