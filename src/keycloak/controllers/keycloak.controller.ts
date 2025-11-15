import { Controller } from '@nestjs/common';
import { KeycloakService } from '../services/keycloak.service';
import { MessagePattern } from '@nestjs/microservices';
import { newUserDto } from '../dto/new-user.dto';
import { loginUserDto } from '../dto/login-user.dto';

@Controller()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) { }


  @MessagePattern('auth-ms.keycloak.create-user')
  edituser(data: newUserDto) {
    return this.keycloakService.createUser(data);
  }

  @MessagePattern('auth-ms.keycloak.get.roles')
  getRoles() {
    return this.keycloakService.getRolesURL();
  }

  @MessagePattern('auth-ms.keycloak.login-user')
  loginUser(data: loginUserDto) {
    return this.keycloakService.login(data);
  }

  @MessagePattern('auth-ms.keycloak.valid.token')
  validateToken({ token }: { token: string }) {
    return this.keycloakService.validToken(token);
  }

  @MessagePattern('auth-ms.keycloak.refresh.token')
  refreshToken({ refreshToken }: { refreshToken: string }) {
    return this.keycloakService.refreshToken(refreshToken);
  }


}
