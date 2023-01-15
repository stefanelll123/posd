export interface IUser {
    email: string;
    password: string;
    showPassword: boolean;
    code: string;
    name: string;
}

export interface IUserConfirmation {
    name: string;
    address: string;
    password: string;
    showPassword: boolean;
}