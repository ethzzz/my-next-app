'use client'
import styles from './header.module.scss'
import { useUserStore } from '@/store/user'

export function Header() {
    return (
        <div className={styles['header-content']}>header</div>
    )
}