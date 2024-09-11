import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    console.log(request)
    return NextResponse.json({})
}

export async function POST(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    try{
        const res = await fetch("http://localhost:3002/system/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request.body)
        })
        const data = await res.json()
        return NextResponse.json({
            ...data
        })
    }catch(err){
        return NextResponse.json({code:1,msg:err})
    }
}