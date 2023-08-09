import * as bcrypt from 'bcrypt';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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
      const errors: ResError = {};

      if (!email) {
        errors.email = 'Введите email!';
      }

      if (!user_name) {
        errors.user_name = 'Введите имя!';
      }

      const candidateEmail = await this.authService.findUserByEmail(email);
      const candidateUserName = await this.authService.findUserByUserName(
        user_name,
      );

      if (candidateEmail) {
        errors.email = 'Пользователь с таким email уже существует';
      }

      if (candidateUserName) {
        errors.user_name = 'Пользователь с таким именем уже существует';
      }

      if (!password) {
        errors.password = 'Придумайте пароль!';
      }

      if (password && !password_repeat) {
        errors.password_repeat = 'Повторите пароль!';
      }

      if (password !== password_repeat) {
        errors.password = 'Пароли не совпадают!';
      }

      if (Object.keys(errors).length > 0 || !email || !user_name) {
        return res.status(400).json({
          status: 400,
          errors,
          mainMessage: 'Что-то пошло не так',
        });
      }

      const passwordHashed = await bcrypt.hash(password, 12);

      const newUser = await this.authService.createUser(
        email,
        user_name,
        passwordHashed,
      );

      const accessToken = this.authService.generateAccessToken(newUser.id);

      const refreshToken = this.authService.generateRefreshToken(newUser.id);

      const sendUser = {
        id: newUser.id,
        email: newUser.email,
        user_name: newUser.user_name,
        created_at: newUser.created_at,
      };

      return res.json({
        message: 'Пользователь создан успешно!',
        accessToken,
        refreshToken,
        user: sendUser,
      });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Ошибка сервера' });
    }
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body('password') password: string,
    @Body('email_or_user_name') email_or_user_name: string,
  ) {
    try {
      if (!email_or_user_name) {
        return res.status(400).json({ message: 'Введите почту или имя!' });
      }

      const user = await this.authService.findUserByEmailOrUserName(
        email_or_user_name,
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

      const sendUser = {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        created_at: user.created_at,
      };

      return res.json({
        message: 'Вход выполнен успешно!',
        accessToken,
        refreshToken,
        user: sendUser,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  @Post('new-access-token')
  async newAccessToken(
    @Res() res: Response,
    @Body('refresh_token') refresh_token: string,
  ) {
    try {
      const userId = this.authService.verifyToken(refresh_token).userId;

      if (!userId) {
        return res
          .status(400)
          .json({ status: 400, message: 'Нет авторизации' });
      }

      const accessToken = this.authService.generateAccessToken(userId);

      return res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Ошибка сервера' });
    }
  }

  @Get('get-me')
  async getMe(
    @Res() res: Response,
    @Query('accessToken') accessToken?: string,
  ) {
    try {
      if (!accessToken) {
        return;
      }

      const { userId } = this.authService.verifyToken(accessToken);

      const user = await this.authService.findUserById(userId);

      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: 'Пользователь не найден' });
      }

      const sendUser = {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        created_at: user.created_at,
      };

      return res.json({ user: sendUser });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Ошибка сервера' });
    }
  }
}
