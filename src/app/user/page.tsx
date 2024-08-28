// 'use client'
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import CustomButton from "./CustomButton"

export const metadata: Metadata = {
    title: "User",
}


export default function User() {
    const isGoHome = false

    isGoHome && redirect("/")

    return (
        <main className="flex min-h-screen flex-col items-center">
            <CustomButton />
        </main>
    )
}