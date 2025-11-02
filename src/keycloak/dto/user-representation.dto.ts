export class CredentialDto {
    type: string;
    value: string;
    temporary: boolean;
}

export class userRepresentationDto {
    username: string;
    firstName: string;
    lastName: string;
    
    emailVerified: boolean;
    enabled: boolean;
    credentials: CredentialDto[];
}
