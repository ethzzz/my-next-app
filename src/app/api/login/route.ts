import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { LoginRequestBody, UserInfo } from "@/types/system";

const SECRET_KEY = "ethan";
const TOKEN_EXPIRATION = "1d";

const userList: UserInfo[] = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: 'https://timg.foguetebet.com/avatar/1.jpg',
    },
    {
        id: 2,
        username: 'user',
        password: '123456',
        avatar: '',
    }
]

// generate JWT Token
function generateToken(payload: object) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
}

// verify JWT Token
function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}

// 验证token是否有效
export async function GET(request: NextRequest) {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ code: 1, msg: "未登录" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ code: 1, msg: "token无效" });
    }
    return NextResponse.json({ code: 0, msg: "token有效", data: decoded });
}

// login function
export async function POST(request: NextRequest) {
    // const pathname = request.nextUrl.pathname
    try{
        const body: LoginRequestBody = await request.json()
        const { username, password } = body;
        if(!username || !password){
            return NextResponse.json({code:1,msg:"用户名或密码不能为空"})
        }
        const user = userList.find(item => item.username === body.username)
        if(!user){
            return NextResponse.json({code:1,msg:"该用户不存在"})
        }
        if(user.password !== body?.password){
            return NextResponse.json({code:1,msg:"密码错误"})
        }
        return NextResponse.json({code:0,msg:"登录成功",data: user})
    }catch(err){
        return NextResponse.json({code:1,msg:err})
    }
}