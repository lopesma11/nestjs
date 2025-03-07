import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: CreateUserDTO) {
    if (
      !(await this.usersRepository.exist({
        where: {
          email: data.email,
        },
      }))
    ) {
      throw new BadRequestException(`Este e-mail já está sendo usado`);
    }
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    const user = this.usersRepository.create(data);

    return this.usersRepository.save([user]);
  }

  async readUsers() {
    return this.usersRepository.find();
  }

  async readUser(id: number) {
    await this.exists(id);
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async updateUser(
    id: number,
    { name, email, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    await this.usersRepository.update(id, {
      name,
      email,
      password,
      birthAt: birthAt ? new Date(birthAt) : null,
      role,
    });

    return this.readUser(id);
  }

  async udpatePartialUser(
    id: number,
    { name, email, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);
    const data: any = {};

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();

      data.password = await bcrypt.hash(password, salt);
    }

    if (role) {
      data.role = role;
    }
    await this.usersRepository.update(id, data);

    return this.readUser(id);
  }

  async deleteUser(id: number) {
    if (!(await this.readUser(id))) {
      throw new NotAcceptableException(
        `O usuário com este o id ${id} não existe`,
      );
    }
    return this.usersRepository.delete(id);
  }

  async exists(id: number) {
    if (
      !(await this.usersRepository.exists({
        where: { id },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
