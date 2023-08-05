import * as bcrypt from 'bcrypt';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ResError } from 'src/types/main';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async createUser(
    @Res() res: Response,
    @Body('email') email: string,
    @Body('user_name') user_name: string,
    @Body('password') password: string,
    @Body('password_repeat') password_repeat: string,
  ) {
    try {
      const candidateEmail = await this.authService.findUserByEmail(email);
      const candidateUserName = await this.authService.findUserByUserName(
        user_name,
      );

      const errors: ResError[] = [];

      if (candidateEmail) {
        errors.push({
          type: 'email',
          message: 'Пользователь с таким email уже существует',
        });
      }

      if (candidateUserName) {
        errors.push({
          type: 'user_name',
          message: 'Пользователь с таким именем уже существует',
        });
      }

      if (password !== password_repeat) {
        errors.push({
          type: 'password',
          message: 'Пароли не совпадают!',
        });
      }

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ errors, mainMessage: 'Что-то пошло не так' });
      }

      const passwordHashed = await bcrypt.hash(password, 12);

      const newUser = await this.authService.createUser(
        email,
        user_name,
        passwordHashed,
      );

      const accessToken = this.authService.generateAccessToken(newUser.id);
      const refreshToken = this.authService.generateRefreshToken(newUser.id);

      return res.json({
        message: 'Пользователь создан успешно!',
        accessToken,
        refreshToken,
        user: newUser,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body('password') password: string,
    @Body('emailOrUserName') emailOrUserName?: string,
  ) {
    try {
      if (!emailOrUserName) {
        return res.json(400).json({ message: 'Введите почту или имя!' });
      }

      const user = await this.authService.findUserByEmailOrUserName(
        emailOrUserName,
      );

      if (!user) {
        return res.status(400).json({ message: 'Пользователя не существует' });
      }

      const verifyPassword = await bcrypt.compare(password, user.password);

      if (!verifyPassword) {
        return res.status(400).json({ message: 'Неверный пароль!' });
      }

      const accessToken = this.authService.generateAccessToken(user.id);
      const refreshToken = this.authService.generateRefreshToken(user.id);

      return res.json({
        message: 'Вход выполнен успешно!',
        accessToken,
        refreshToken,
        user,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}
