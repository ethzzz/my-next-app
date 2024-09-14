'use client'
import dynamic from 'next/dynamic'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Path } from '@/types/constant'
import LoadingIcon from "../icons/three-dots.svg";
import BotIcon from "../icons/bot.svg";
import styles from './home.module.scss'
import { useSystemStore } from "@/store/system"
import { 
    HashRouter as Router,
    Routes,
    Route
} from 'react-router-dom'

// 组件加载loading
export function Loading(props: { noLogo?: boolean }) {
    return (
        <div className={styles["loading-content"] + " no-dark"}>
            {!props.noLogo && <BotIcon />}
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

function Screen(){

    const renderContent = () =>{
        return (
            <>
                <Header />
                <WindowContent>
                    <Routes>
                        <Route path={Path.HOME} element={<Content />} />
                        <Route path={Path.USER} element={<User />} />
                        <Route path={Path.SERVER_RENDER } element={<ServerRender />} />
                        <Route path={Path.CATEGORY} element={<Category />} />
                    </Routes>
                </WindowContent>
                <Footer />
            </>
        )
    }

    return (
        <div className={styles['container'] + " no-dark"}>
            {renderContent()}
        </div>
    )
}

export function Home(){
    return (
        <>  
            <Router>
                <Screen />
            </Router>
        </>
    )
}