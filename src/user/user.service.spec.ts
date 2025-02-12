import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryMock } from '../testing/user-repository-mock';
import { CreateUserDTO } from './dto/create-user.dto';
import { Role } from '../enums/role.enum';
import { userEntityList } from '../testing/user-entity-list-mock';
import { createUserDTO } from '../testing/create-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  test('Validar a definição', () => {
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    test('method create', async () => {
      const result = await userService.createUser(createUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {});
  describe('Update', () => {});
  describe('Delete', () => {});
});
