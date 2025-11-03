import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
import { Repository } from 'typeorm';
import { newUserDto } from '../dto/new-user.dto';
import { CredentialDto, userRepresentationDto } from '../dto/user-representation.dto';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config';
import { RpcException } from '@nestjs/microservices';
import { RoleDataDto } from '../dto/role-data.dto';
import { loginUserDto } from '../dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { UserLoginDtoResponse } from '../dto/user-login.dto';

@Injectable()
export class KeycloakService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService,

    ) {
    }
    async createUser(data: newUserDto) {
        try {
            const { password, firstName, lastName, username } = data;
            let token = await this.getadmintoken()
            let roleUser = await this.getRole(token, 'user');
            // verificar roly token que existan 
            if (!roleUser) {
                throw new Error('Role user not found');
            }
            if (!token) {
                throw new Error('Admin token not obtained');
            }
            // Crear usuario
            const userdata = new userRepresentationDto();
            userdata.username = username;
            userdata.firstName = firstName;
            userdata.lastName = lastName;
            userdata.emailVerified = true;
            userdata.enabled = true;

            // Crear credencial
            const credential = new CredentialDto();
            credential.type = 'password';
            credential.temporary = false;
            credential.value = password;

            userdata.credentials = [credential];
            userdata.enabled = true;
            userdata.emailVerified = false;

            const response = await firstValueFrom(this.httpService.post(`${envs.keycloak.adminBaseUrl}/users`, userdata, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }))

            const locationHeader = response.headers['location'];
            const userId = locationHeader.split('/').pop();
            // Asignar rol al usuario
            await firstValueFrom(
                this.httpService.post(
                    `${envs.keycloak.adminBaseUrl}/users/${userId}/role-mappings/realm`,
                    [roleUser],
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );


            const responseEmail = await this.httpService.put(
                `${envs.keycloak.adminBaseUrl}/users/${userId}/send-verify-email`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return { status: 200, message: 'User created and verification email sent', data: responseEmail };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async login(data: loginUserDto) {
        try {
            const { username, password } = data;
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('grant_type', 'password');
            formData.append('client_id', envs.keycloak.clientLOGINId);
            formData.append('client_secret', envs.keycloak.clientLOGINSecret);
            formData.append('scope', 'openid');
            const response = await firstValueFrom(
                this.httpService.post(envs.keycloak.loginUrl, formData.toString(), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
            );
            const decoded: any = jwt.decode(response.data.access_token);
            const userData: UserLoginDtoResponse = {
                token: response.data,
                user: {
                    username: decoded.preferred_username,
                    roles: decoded.realm_access.roles,
                    email: decoded.email,
                    name: decoded.name
                }
            }
            return {
                status: 200,
                message: 'Login successful',
                data: userData
            };

        } catch (error) {
            // 📜 Log completo del error para debugging
            console.error('🔴 Error Keycloak login:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
            });

            // Lanzamos el error de forma más clara para NestJS
            throw new RpcException({
                status: error.response?.status || 500,
                message: error.response?.data?.error_description || error.message || 'Unexpected error'
            });
        }
    }



    async getRolesURL() {
        try {
            const token = await this.getadmintoken()
            const roles = await this.getRole(token, 'user');

            return {
                status: 200,
                message: 'Roles fetched successfully',
                data: roles
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async getRole(token: string, roleName: string): Promise<RoleDataDto> {
        try {
            const realmRolesResponse = await firstValueFrom(
                this.httpService.get(`${envs.keycloak.domain}/admin/realms/nestjs-tutorial/roles/${roleName}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            );
            const availableRoles = realmRolesResponse.data;
            if (!availableRoles) {
                throw new Error('Role not found');
            }
            const roleData = new RoleDataDto();
            roleData.id = availableRoles.id;
            roleData.name = availableRoles.name;
            return roleData;
        } catch (error) {
            throw new Error('Error getting roles from Keycloak');
        }
    }

    async getadmintoken(): Promise<string> {
        try {


            const formData = new URLSearchParams();
            formData.append('client_id', envs.keycloak.adminClientId);
            formData.append('client_secret', envs.keycloak.adminClientSecret);
            formData.append('grant_type', 'client_credentials');
            const response = await firstValueFrom(
                this.httpService.post(envs.keycloak.loginUrl, formData.toString(), {
                    headers: {
                        'Content-Type': `application/x-www-form-urlencoded`
                    }
                })
            );
            const { access_token } = response.data;
            return access_token;

        } catch (error) {

            throw new Error('Error creating user in Keycloak');
        }
    }

    async refreshToken(refresh_token: string) {
        try {
            const formData = new URLSearchParams();
            formData.append('client_id', envs.keycloak.clientLOGINId);
            formData.append('client_secret', envs.keycloak.clientLOGINSecret);
            formData.append('grant_type', 'refresh_token');
            formData.append('refresh_token', refresh_token);
            const response = await firstValueFrom(
                this.httpService.post(envs.keycloak.loginUrl, formData.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }),
            );

            return response.data;
        }
        catch (error) {
            throw new Error('Error refreshing token');
        }
    }


    async validToken(token: string) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', token);
            formData.append('client_id', envs.keycloak.adminClientId);
            formData.append('client_secret', envs.keycloak.adminClientSecret);

            const introspectUrl = `${envs.keycloak.domain}/realms/${envs.keycloak.realm}/protocol/openid-connect/token/introspect`;

            const response = await firstValueFrom(
                this.httpService.post(introspectUrl, formData.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }),
            );

            return response.data; // Devuelve el resultado del introspect
        } catch (error) {
            console.error('Error validando token:', error.message);
            throw new Error('Token inválido o error en la introspección');
        }
    }

}
