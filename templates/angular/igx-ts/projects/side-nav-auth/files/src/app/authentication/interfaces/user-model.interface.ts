export interface IUser {
    id: number;
    name: string;
    email: string;
    picture: string;
    token: string;
    externalToken?: string;
}
