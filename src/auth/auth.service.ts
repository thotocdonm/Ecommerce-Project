import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ILoginSocialMedia, IUser } from 'src/interface/user.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email)
        if (user) {
            const isValidPassword = bcrypt.compareSync(pass, user.password);
            if (user && isValidPassword) {
                return user
            }
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, isVerify } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        //create refresh_token
        const refresh_token = await this.createRefreshToken(payload);

        //set user refresh token
        let res = await this.usersService.updateUserToken(refresh_token, _id)

        //set refresh token to cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
        })
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refresh_token,
            user: {
                _id,
                name,
                email,
                role,
                isVerify
            },

        };
    }

    async socialLogin(email: string, type: string, response: Response): Promise<any> {
        // Check if user exists
        let user = await this.usersService.findOneByEmail(email);

        if (!user) {
            // Create new user if not found
            const res = await this.usersService.socialCreate(email, type)
            return this.login(res, response)
        }

        const { _id, name, role, email: userEmail, isVerify } = user

        const userId = _id.toString();

        // Reuse the existing login function
        return this.login({ _id: userId, name, role, email: userEmail, isVerify }, response);
    }


    async createRefreshToken(payload) {
        return this.jwtService.sign(
            payload,
            {
                expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            }
        )
    }

    async processNewToken(refreshToken: string, response: Response) {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })
            let user = await this.usersService.findOneByToken(refreshToken)

            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                //create refresh_token
                const refresh_token = await this.createRefreshToken(payload);

                //set user refresh token
                let res = await this.usersService.updateUserToken(refresh_token, _id as unknown as string)

                //set refresh token to cookies
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
                })
                return {
                    access_token: this.jwtService.sign(payload),
                    refresh_token: refresh_token,
                    user: {
                        _id,
                        name,
                        email,
                        role,
                    },

                };
            } else {
                throw new BadRequestException('Refresh token không hợp lệ, vui lòng đăng nhập lại')
            }

        } catch (error) {
            throw new BadRequestException('Refresh token không hợp lệ, vui lòng đăng nhập lại')
        }
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.register(createUserDto)

    }

    async verifyOTP(email: string, otp: string) {
        return this.usersService.verifyOTP(email, otp)

    }

    async getAccount(user: IUser) {
        return { user }
    }

    async logOut(user: IUser, response: Response) {
        let res = this.usersService.updateUserToken(null, user._id)
        response.clearCookie('refresh_token')
        return 'ok'
    }
}