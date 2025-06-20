export interface UserInfo {
    id: number,
    username: string,
    password: string,
    avatar: string,
    token?: string,
}

export interface LoginRequestBody {
    username: string,
    password: string,
    captcha? : string
}