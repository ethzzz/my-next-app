'use client'
import { Sidebar } from '../sidebar'
import styles from './home.module.scss'
import { useSystemStore } from "../../store/system"
import allComponents from '..'

import { ErrorBoundary } from "../error";

import {
    HashRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

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
                <Routes>
                    {Object.entries(allComponents).map(([name, Component]) => (
                        <Route 
                            key={`/functions/${name}`}
                            path={`/functions/${name}`}
                            element={<Component />}
                        />
                    ))}
                </Routes>
            </div>
        </div>
    )
}

export default function Home(){
    return (
        <ErrorBoundary>  
            <Router>
                <Screen />
            </Router>
        </ErrorBoundary>
    )
}