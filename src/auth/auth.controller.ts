import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/interface/user.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Public()
    @ResponseMessage('Login with cresdential')
    @Post('/login')
    async login(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response)
    }

    @ResponseMessage('Get user account')
    @Get('/account')
    async getAccount(@User() user: IUser) {
        return this.authService.getAccount(user)
    }

    @ResponseMessage('Register a new account')
    @Public()
    @Post('/register')
    async registerAccount(@Req() req) {
        return this.authService.register(req.body)
    }

    @ResponseMessage('Get User by refresh token')
    @Public()
    @Get('/refresh')
    async getAccountByRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token']
        return this.authService.processNewToken(refreshToken, response)
    }

    @ResponseMessage('Logout User')
    @Post('/logout')
    async logOut(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.logOut(user, response)
    }
}
