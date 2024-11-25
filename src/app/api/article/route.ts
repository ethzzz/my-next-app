import { NextRequest, NextResponse } from "next/server";

async function handle(request: NextRequest) {
    if(request.method === "GET"){
        return NextResponse.json({})
    }
    if(request.method === "POST"){
        return NextResponse.json({})
    }
}

export const GET = handle
export const POST = handle