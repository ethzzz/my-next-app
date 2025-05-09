'use client'
import React from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import styles from '@/components/Sidebar/Sidebar.module.scss'
import './Sidebar.scss'
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks'
import { setSelectedItem, setExpandedItems } from '@/store/redux/slices/sidebarSlice'
import { useRouter } from 'next/navigation'

interface SidebarProps {
    items: { name: string }[]
}

export function Sidebar() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const selectedItem = useAppSelector((state) => state.sidebar.selectedItem)
    const expandedItems = useAppSelector((state) => state.sidebar.expandedItems)
    const menuItems = useAppSelector((state) => state.sidebar.menuItems)

    const onSelect: MenuProps['onSelect'] = ({ key }) => {
        dispatch(setSelectedItem(key))
        router.push(key)
    }

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        dispatch(setExpandedItems(openKeys))
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles['sidebar-body']}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedItem]}
                    openKeys={expandedItems}
                    items={menuItems}
                    onSelect={onSelect}
                    onOpenChange={onOpenChange}
                    className="custom-menu"
                />
            </div>
        </div>
    )
}