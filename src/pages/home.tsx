'use client'
import dynamic from 'next/dynamic'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/Siderbar'
import { Footer } from '@/components/footer'
import { Path } from '@/types/constant'
import { Tab } from '@/components/Tab'
// import LoadingIcon from "../icons/three-dots.svg";
// import BotIcon from "../icons/bot.svg";
import styles from './home.module.scss'
import * as FunctionComponents from "@/components/Functions";
import { useSystemStore } from "@/store/system"
import { 
    HashRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import { useState } from 'react'

// 组件加载loading
export function Loading(props: { noLogo?: boolean }) {
    return (
        <div className={styles["loading-content"] + " no-dark"}>
            {!props.noLogo}
            {/* <LoadingIcon></LoadingIcon> */}
        </div>
    );
}

// Functions列表
const functionList = Object.entries(FunctionComponents).map(([name, Component]) => {
    return {
        name: name,
        component: <Component />
    }
})

function WindowContent({ children }: Readonly<{ children: React.ReactNode }>) {
    const systemStore = useSystemStore()
    const showHeader = systemStore.getSystem().showHeader
    return (
        <div className={styles['window-content'] + `${showHeader ? '' : ` ${styles['no-header']}`}`}>
            {children}
        </div>
    )
}

const Content = dynamic(async() => (await import('../components/content')).Content, { 
    loading: () => <Loading noLogo />
})

const User = dynamic(async () => (await import("../components/user")).User, {
    loading: () => <Loading noLogo />
});

const Category = dynamic(async() => (await import('../components/[category]')).Category, { 
    loading: () => <Loading noLogo />
})

const ServerRender = dynamic(async() => (await import('../components/server-render')).ServerRender, {
    loading:() => <Loading noLogo />
})

function Screen() {

    const [selected, setSelected] = useState(functionList[0].name)

    // const renderContent = () =>{
    //     return (
    //         <WindowContent>
    //             {/* <Tab items={functionList} /> */}
    //             <Content />
    //         </WindowContent>
    //     )
    // }

    return (
        <div className={styles['container'] + " no-dark"}>
            <Sidebar items={functionList} selected={selected} onSelect={setSelected} />
            <div className={styles['window-content']}>
                {functionList.find(fn => fn.name === selected)?.component}
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