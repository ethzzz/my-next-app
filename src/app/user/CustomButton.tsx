'use client'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function CustomButton(props: any) {
    const router = useRouter()
    const goHome = () => {
        router.push('/')
    }

    return (
        <Button type="primary" onClick={goHome}>Go Home</Button>
    )
}