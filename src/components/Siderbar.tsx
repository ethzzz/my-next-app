import React from 'react'
import styles from '@/pages/home.module.scss'

interface SidebarProps {
    items: { name: string }[]
    selected: string
    onSelect: (name: string) => void
}

export function Sidebar({ items, selected, onSelect }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <div className={styles['sidebar-body']}>
                {items.map(item => (
                    <div
                        key={item.name}
                        className={
                            styles['sidebar-item'] +
                            (selected === item.name ? ' ' + styles['sidebar-item-selected'] : '')
                        }
                        onClick={() => onSelect(item.name)}
                    >
                        <span className={styles['sidebar-item-title']}>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}