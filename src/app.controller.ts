import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller('app')
export class AppController {

    @Get()
    getHello(): string {
        return process.env.DATABASE_HOST || 'Database host not set';
    }
}
