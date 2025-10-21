import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/User.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService
    ) {
    }
    private kratosUrl = process.env.KRATOS_URL || 'http://localhost:4433';

    async findUser(id: string) {
        return this.userRepository.findOne({
            where: { id }
        })
    }

    async registerUser(createUserDto: CreateUserDto) {
        try {
            const { email, password } = createUserDto;
            const flowRes$ = this.httpService.get(`${this.kratosUrl}/self-service/registration/api?refresh=true`);
            const flowRes = await firstValueFrom(flowRes$);
            // Enviar datos de registro
            const registerRes$ = this.httpService.post(flowRes.data.ui.action, {
                method: 'password',
                password: password,
                traits: { email: email },
            });
            const registerRes = await firstValueFrom(registerRes$);
            return {
                status: 200,
                data: registerRes.data
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async example() {
        return { message: 'example response from auth-ms' }
    }

}
