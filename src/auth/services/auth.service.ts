import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
import { Repository } from 'typeorm';
import { CreateUserDto, loginPasswordDto } from '../dto/User.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { envs } from 'src/config';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService
    ) {
    }
    async createAdmin() {
         const checkUrl = `${envs.kratosAdmin}/identities`;
        // 1️⃣ Inicia el flujo de registro
        const response = await firstValueFrom(this.httpService.get(checkUrl));
        const identities = response.data;
        // 2️⃣ Envía los datos al endpoint de acción de Kratos
        // Buscar si ya existe el admin
        const adminExists = identities.some(
            (i) => i.traits.email === envs.adminUser && i.traits.role?.includes('ADMIN')
        );
        if (adminExists) {
            return {
                status: 400,
                message: 'Admin already exists',
            };
        }
         // Crear flujo de registro
        const url = `${envs.kratosurl}/self-service/registration/api`;
        const flowRes = await firstValueFrom(this.httpService.get(url));
        const registerRes$ = this.httpService.post(flowRes.data.ui.action, {
            method: 'password',
            traits: {
                email: envs.adminUser,
                role: ['ADMIN']
            },
            password: envs.adminPassword,
            
        });

        const registerRes = await firstValueFrom(registerRes$);

        return {
            status: 200,
            data: registerRes.data,
        };
    } catch(error) {
        console.error('Error registrando usuario en Kratos:', error?.response?.data || error.message);

        throw new RpcException({
            status: 400,
            message: error?.response?.data || error.message,
        });
    }

    async findUser(id: string) {
        return this.userRepository.findOne({
            where: { id }
        })
    }

    async registerUser(createUserDto: CreateUserDto) {
        try {
            const { email, password } = createUserDto;
            const url = `${envs.kratosurl}/self-service/registration/api`;

            // 1️⃣ Inicia el flujo de registro
            const flowRes = await firstValueFrom(
                this.httpService.get(url)
            );

            // 2️⃣ Envía los datos al endpoint de acción de Kratos


            const registerRes$ = this.httpService.post(flowRes.data.ui.action, {
                method: 'password',
                traits: {
                    email: email,
                    role: ['USER']
                },
                password: password,
               
            });

            const registerRes = await firstValueFrom(registerRes$);

            return {
                status: 200,
                data: registerRes.data,
            };
        } catch (error) {
            console.error('Error registrando usuario en Kratos:', error?.response?.data || error.message);

            throw new RpcException({
                status: 400,
                message: error?.response?.data || error.message,
            });
        }
    }
    async login(loginPasswordDto: loginPasswordDto) {
        try {
            const { email, password } = loginPasswordDto;
            const url = `${envs.kratosurl}/self-service/login/api`;
            const flowResponse = await firstValueFrom(this.httpService.get(url))
            const flow = flowResponse.data;
            const response = await firstValueFrom(
                this.httpService.post(flow.ui.action, {
                    method: 'password',
                    identifier: email,
                    password: password,
                })
            );
            return {
                status: 200,
                data: response.data
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error?.response?.data || error.message,
            });
        }
    }

    async chekSession(sessionToken: string) {
        try {
            const url = `${envs.kratosurl}/sessions/whoami`;
            const flowResponse = await firstValueFrom(this.httpService.get(url, {
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                },
                withCredentials: true,
            }))

            return {
                status: 200,
                data: flowResponse.data
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error?.response?.data || error.message,
            });
        }
    }

    async example() {
        return { message: 'example response from auth-ms' }
    }

}
