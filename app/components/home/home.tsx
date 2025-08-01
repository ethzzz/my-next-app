"use client"

import { Sidebar } from "../sidebar"
import styles from "./home.module.scss"
import { useSystemStore } from "../../store/system"
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from "../../store/redux"
import { flatMenuItems } from "@/app/utils/menu"

import { ErrorBoundary } from "../error";

import {
    HashRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { useEffect, useState } from "react"
import { useAppSelector } from "@/app/store/redux/hooks"
import { MenuItem } from "@/app/types/menu"
import allComponentsMap from "@/app/components"

const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  
    useEffect(() => {
      setHasHydrated(true);
    }, []);
  
    return hasHydrated;
  };

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
    // const showHeader = false
    return (
        <div className={styles['window-content'] + `${showHeader ? '' : ` ${styles['no-header']}`}`}>
            {children}
        </div>
    )
}

function Screen() {
    const menuItems = useAppSelector((state) => state.sidebar.menuItems)

    return (
        <div className={styles['container'] + " no-dark"}>
            <Sidebar />
            <WindowContent>
                <Routes>
                    {flatMenuItems(menuItems).map((item:MenuItem) => {
                        return (
                            <Route
                                path={item.key}
                                key={item.key}
                                element={
                                    <ErrorBoundary>
                                        {(() => {
                                            const Component = allComponentsMap.get(item.name);
                                            return Component ? <Component /> : null;
                                        })()}
                                    </ErrorBoundary>
                                }
                            />
                        );
                    })
                    }
                </Routes>
            </WindowContent>
        </div>
    )
}

export default function Home(){

    if (!useHasHydrated()) {
        return <Loading />; 
    }

    return (
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    <Router>
                        <Screen />
                    </Router>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    )
}