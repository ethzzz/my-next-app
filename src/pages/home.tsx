'use client'
import dynamic from 'next/dynamic'
import { Header } from './header'
import { Path } from '@/types/constant'
import LoadingIcon from "../icons/three-dots.svg";
import BotIcon from "../icons/bot.svg";
import styles from './home.module.scss'
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
        <LoadingIcon />
        </div>
    );
}

function WindowContent({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className={styles['window-content']}>
            {children}
        </div>
    )
}

/* const Content = dynamic(async() => (await import('./content')).Content, { 
    loading: () => <Loading noLogo />
}) */

function Screen(){

    const renderContent = () =>{
        return (
            <>
                <Header />
                <WindowContent>
                    <Routes>
                        <Route path={Path.HOME} element={<div />}></Route>
                    </Routes>
                </WindowContent>
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