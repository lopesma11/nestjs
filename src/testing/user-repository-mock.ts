import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { userEntityList } from './user-entity-list-mock';

export const userRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    exist: jest.fn(),
    create: jest.fn(),
    save: jest.fn().mockResolvedValue(userEntityList[0]),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
