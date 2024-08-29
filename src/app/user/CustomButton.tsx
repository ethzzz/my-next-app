'use client'
import { Button } from 'antd'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'


export default function CustomButton(props: any) {
    const router = useRouter()
    const goHome = () => {
        router.push('/')
    }
    // 改变标题
    const changeTitle = () => {
        
    }

    return (
        <>
            <Button type="primary" onClick={goHome}>Go Home</Button>
            <Button type="primary" onClick={changeTitle}>Change Title</Button>
        </>
    )
}