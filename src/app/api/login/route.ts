import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    console.log(request)
    return NextResponse.json({})
}

const userList = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: 'https://timg.foguetebet.com/avatar/1.jpg',
        token: 'qsadaeqwrwqr'
    },
    {
        id: 2,
        username: 'user',
        password: '123456',
        avatar: '',
        token: 'asfdasfsfewqf'
    }
]

export async function POST(request: NextRequest) {
    // const pathname = request.nextUrl.pathname
    try{
        // const res = await fetch("http://localhost:3002/system/login",{
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(request.body)
        // })
        // const data = await res.json()
        // return NextResponse.json({
        //     ...data
        // })
        const body = await request.json()
        if(!body.username || !body.password){
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