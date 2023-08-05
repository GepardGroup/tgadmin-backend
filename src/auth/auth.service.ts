import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private authRepository: Repository<User>,
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

  generateAccessToken(userId: number) {
    return jwt.sign({ userId }, process.env.SECRET_KEY_TOKEN, {
      expiresIn: '1d',
    });
  }

  generateRefreshToken(userId: number) {
    return jwt.sign({ userId }, process.env.SECRET_KEY_TOKEN);
  }

  verifyRefreshToken(refreshToken: string): { userId: number | undefined } {
    const payload = jwt.verify(refreshToken, process.env.SECRET_KEY_TOKEN) as {
      userId: number;
    };

    if (payload) {
      return payload;
    } else {
      return { userId: undefined };
    }
  }
}
