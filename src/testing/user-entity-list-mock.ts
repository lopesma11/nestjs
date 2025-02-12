import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    name: 'Matheus Lopes',
    email: 'matheuslopes@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: '$2b$10$7Mar9Qm0/S9y30IPhGU8lOxmGXgnxgxYuVidGEpS7EoW/eHUa4eJ6',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Maria Eduarda Lopes Manoel',
    email: 'mariaeduarda@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: '$2b$10$7Mar9Qm0/S9y30IPhGU8lOxmGXgnxgxYuVidGEpS7EoW/eHUa4eJ6',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Paulo Sergio Manoel',
    email: 'paulosergio@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: '$2b$10$7Mar9Qm0/S9y30IPhGU8lOxmGXgnxgxYuVidGEpS7EoW/eHUa4eJ6',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Vanessa Silveira Lopes Manoel',
    email: 'vanessamanoel@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: '$2b$10$7Mar9Qm0/S9y30IPhGU8lOxmGXgnxgxYuVidGEpS7EoW/eHUa4eJ6',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
