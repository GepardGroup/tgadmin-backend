import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private authRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async createUser(
    email: string,
    user_name: string,
    password: string,
  ): Promise<User> {
    const user = this.authRepository.create({ email, user_name, password });

    return await this.authRepository.save(user);
  }

  async findUserByEmail(email: string) {
    return await this.authRepository.findOne({ where: { email } });
  }

  async findUserByUserName(user_name: string) {
    return await this.authRepository.findOne({ where: { user_name } });
  }

  async findUserByEmailOrUserName(value: string) {
    return await this.authRepository.findOne({
      where: [{ email: value }, { user_name: value }],
    });
  }

  async findUserById(id: number) {
    return await this.authRepository.findOne({ where: { id } });
  }

  generateAccessToken(userId: number) {
    return jwt.sign(
      { userId },
      this.configService.get<string>('SECRET_KEY_TOKEN'),
      {
        expiresIn: '1d',
      },
    );
  }

  generateRefreshToken(userId: number) {
    return jwt.sign(
      { userId },
      this.configService.get<string>('SECRET_KEY_TOKEN'),
    );
  }

  verifyToken(token: string): { userId: number | undefined } {
    const payload = jwt.verify(
      token,
      this.configService.get<string>('SECRET_KEY_TOKEN'),
    ) as {
      userId: number;
    };

    if (payload) {
      return payload;
    } else {
      return { userId: undefined };
    }
  }
}
