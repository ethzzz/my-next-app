// 'use client'
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import CustomButton from "./CustomButton"

const metadata: Metadata = {
    title: "User",
}

export default function User() {


    const changeTitle = ()=>{
        metadata.title = "New Title"
    }

    const isGoHome = true

    isGoHome && redirect("/")

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <CustomButton />
        </main>
    )
}