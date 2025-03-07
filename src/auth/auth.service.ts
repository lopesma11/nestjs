import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
          // notBefore: Math.ceil((Date.now() + 1000 * 60 * 60) / 1000),
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async loginUser(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException(`E-mail e/ou senha incorretos`);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(`E-mail e/ou senha incorretos`);
    }

    return this.createToken(user);
  }

  async forgetPassword(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new UnauthorizedException(`E-mail está incorreto`);
    }
    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );
    await this.mailer.sendMail({
      subject: 'Recuperação de Senha',
      to: 'matheuslopes@gmail.com',
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });
    return true;
  }

  async resetPassword(password: string, token: string) {
    try {
      const data: any = this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'forget',
      });
      if (isNaN(Number(data.id)))
        throw new BadRequestException('Token é inválido.');
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      await this.usersRepository.update(Number(data.id), {
        password,
      });

      const user = await this.userService.readUser(Number(data.id));
      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async registerUser(data: AuthRegisterDTO) {
    const user = await this.userService.createUser(data);

    return this.createToken(user);
  }
}
