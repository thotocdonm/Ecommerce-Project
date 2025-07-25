import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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

    @Public()
    @ResponseMessage('Login with social media')
    @Post('/login-social')
    async loginSocial(@Body() body, @Res({ passthrough: true }) response: Response) {
        return this.authService.socialLogin(body.email, body.type, response)
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

    @Public()
    @ResponseMessage('Verify email')
    @Post('/verify')
    async verify(@Body() body) {
        return this.authService.verifyOTP(body.email, body.otp)
    }

    @ResponseMessage('Get User by refresh token')
    @Public()
    @Post('/refresh')
    async getAccountByRefreshToken(@Body('refresh_token') refreshToken: string, @Res({ passthrough: true }) response: Response) {
        return this.authService.processNewToken(refreshToken, response)
    }

    @ResponseMessage('Logout User')
    @Post('/logout')
    async logOut(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.logOut(user, response)
    }
}
