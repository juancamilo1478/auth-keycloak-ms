

export class UserLoginDto {
    username: string;
    roles: string[];
    email: string;
    name: string;

}
export class tokenResponseDto {
    acces_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
}



export class UserLoginDtoResponse {
    token: tokenResponseDto;
    user: UserLoginDto;
} 
