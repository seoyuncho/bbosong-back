import { Controller, Body, Post, Query, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;
        await this.userService.createUser(name, email, password);
        console.log('User created:', dto);        
    }
    // Logic to handle user creation

    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<String> {
        console.log('Email verification requested:', dto);
        const { signupVerifyToken } = dto;
        return await this.userService.verifyEmail(signupVerifyToken);
    }
    // Logic to handle email verification

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<String> {
        console.log('User login attempted:', dto);
        const { email, password } = dto;
        return await this.userService.login(email, password);
    }
    // Logic to handle user login

    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        console.log('Fetching user info for ID:', userId);
        return await this.userService.getUserInfo(userId);
    }
    // Logic to fetch user information by ID
}
