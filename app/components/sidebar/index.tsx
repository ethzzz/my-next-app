'use client'
import React, { useEffect } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.scss'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../../store/redux/hooks'
import { setSelectedItem, setExpandedItems } from '../../store/redux/slices/sidebarSlice'
import { useRouter } from 'next/navigation'
import { useNavigate } from 'react-router-dom'

// 检查路径是否存在于 Next.js 路由中
const checkNextRoute = async (path: string): Promise<boolean> => {
    try {
        // 移除开头的斜杠
        const routePath = path.startsWith('/') ? path.slice(1) : path
        // 尝试动态导入对应的页面组件
        await import(`@/app/${routePath}/page`)
        return true
    } catch (error) {
        return false
    }
}

export function Sidebar() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const navigate = useNavigate()
    const selectedItem = useAppSelector((state) => state.sidebar.selectedItem)
    const expandedItems = useAppSelector((state) => state.sidebar.expandedItems)
    const menuItems = useAppSelector((state) => state.sidebar.menuItems)

    const onSelect: MenuProps['onSelect'] = async ({ key }) => {
        dispatch(setSelectedItem(key))
        
        // 检查是否存在 Next.js 路由
        const hasNextRoute = await checkNextRoute(key)
        
        if (hasNextRoute) {
            // 如果存在 Next.js 路由，使用 Next.js 导航
            router.push(key)
        } else {
            // 如果不存在，使用 React Router 导航
            navigate(key)
        }
    }

    useEffect(() => {
        if (menuItems.length > 0 && menuItems[0].children && menuItems[0].children.length > 0) {
            onSelect({ key: menuItems[0].children[0].key } as any)
        }
    }, [menuItems])

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        dispatch(setExpandedItems(openKeys))
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles['sidebar-body']}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedItem]}
                    defaultOpenKeys={expandedItems}
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