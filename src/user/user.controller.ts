import { Controller, Body, Post, Query, Get, Param } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/user-info-dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password, gender, birthdate, userType } = dto;
        // birthdate를 'YYYY-MM-DD' 형식으로 변환
        const birthdateOnly = new Date(birthdate).toISOString().slice(0, 10);
        await this.userService.createUser(name, email, password, gender, birthdateOnly, userType);
        console.log('User created:', { ...dto, birthdate: birthdateOnly });
    }
    // Logic to handle user creation

    @Get('email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto, @Res() res: Response): Promise<any> {
            console.log('Email verification requested:', dto);
            const { signupVerifyToken } = dto;
            await this.userService.verifyEmail(signupVerifyToken);
            return res.send(`
                <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f7fafd;">
                    <div style="text-align:center;background:#fff;padding:40px 32px;border-radius:16px;box-shadow:0 2px 12px #e0e7ef;">
                        <h2 style="color:#4a90e2;margin-bottom:16px;">이메일 인증이 완료되었습니다!</h2>
                        <p style="font-size:16px;color:#333;">이제 앱에서 로그인해 주세요.</p>
                    </div>
                </div>
            `);
    }
    // Logic to handle email verification

    @Post('login')
    async login(@Body() dto: UserLoginDto): Promise<{ token: string }> {
        console.log('User login attempted:', dto);
        const { email, password } = dto;
        const token = await this.userService.login(email, password);
        return { token };
    }
    // Logic to handle user login

    @Get(':id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfoDto> {
        console.log('Fetching user info for ID:', userId);
        return await this.userService.getUserInfo(userId);
    }
    // Logic to fetch user information by ID
}
