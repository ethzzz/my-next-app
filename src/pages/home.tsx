'use client'
import dynamic from 'next/dynamic'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { Footer } from '@/components/footer'
import { Path } from '@/types/constant'
import { Tab } from '@/components/Tab'
// import LoadingIcon from "../icons/three-dots.svg";
// import BotIcon from "../icons/bot.svg";
import styles from './home.module.scss'
import { useSystemStore } from "@/store/system"

// 组件加载loading
export function Loading(props: { noLogo?: boolean }) {
    return (
        <div className={styles["loading-content"] + " no-dark"}>
            {!props.noLogo}
            {/* <LoadingIcon></LoadingIcon> */}
        </div>
    );
}

function WindowContent({ children }: Readonly<{ children: React.ReactNode }>) {
    const systemStore = useSystemStore()
    const showHeader = systemStore.getSystem().showHeader
    return (
        <div className={styles['window-content'] + `${showHeader ? '' : ` ${styles['no-header']}`}`}>
            {children}
        </div>
    )
}

function Screen() {
    return (
        <div className={styles['container'] + " no-dark"}>
            <Sidebar />
            <div className={styles['window-content']}>
                
            </div>
        </div>
    )
}

export default function Home(){
    return (
        <>  
            <Screen />
        </>
    )
}