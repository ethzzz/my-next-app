import styles from './index.module.scss'
import React, { FC } from 'react'

interface FunctionItemProps{
    children: React.ReactNode
}

export function FunctionItem(props:FunctionItemProps){
    const { children } = props
    return(
        <div className={styles["function-item"]}>
            {children}
        </div>
    )
}

interface HeaderProps{
    children: React.ReactNode
}

export const FunctionItemHeader: FC<HeaderProps> = (props) => {
    const { children } = props
    return (
        <div className={styles["function-item__title"]}>
            {children}
        </div>
    )
}

interface ContentProps{
    children: React.ReactNode
}

export const FunctionItemContent: FC<ContentProps> = (props) => {
    const { children } = props
    return (
        <div className={styles["function-item__content"]}>
            {children}
        </div>
    )
}