import { Test } from '@nestjs/testing';

import { TasksService } from '../src/tasks/tasks.service';
import { TasksRepository } from '../src/tasks/tasks.repository';
import { TaskStatus } from '../src/tasks/task-status.enum';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
  });
  const mockUser = {
    username: 'Mateus',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
  };

  beforeEach(async () => {
    //initialize a nestjs module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    describe('Error Test', () => {
      it('Should calls TasksRepository.getTasks and return the result', () => {
        expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      });
      it('Should calls TasksRepository.findOne and returns an error', () => {
        tasksRepository.findOne.mockResolvedValue(null);

        expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('Pass Test', () => {
      it('Should calls TasksRepository.getTasks and return the result', async () => {
        tasksRepository.getTasks.mockResolvedValue('test');
        const result = await tasksService.getTasks(null, mockUser);
        expect(result).toEqual('test');
      });
      it('Should calls TasksRepository.findOne and returns the result', async () => {
        const mockTask = {
          title: 'Test title',
          description: 'Test desc',
          id: 'someId',
          status: TaskStatus.OPEN,
        };
        tasksRepository.findOne.mockResolvedValue(mockTask);

        const result = await tasksService.getTaskById('someId', mockUser);
        expect(result).toEqual(mockTask);
      });
    });
  });
});
