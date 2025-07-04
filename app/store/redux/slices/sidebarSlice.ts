'use client'
// src/store/slices/sidebarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as FunctionComponents from '../../../components/functions';
import allComponents from '@/app/components';

interface MenuItem {
    key: string
    label: string
    path: string
    component?: React.ComponentType<any>
    children?: MenuItem[]
}

interface SidebarState {
  initSelectedItem?: string
  selectedItem: string
  expandedItems: string[]
  menuItems: MenuItem[]
}

const FunctionMenuItems = Object.entries(FunctionComponents).map(([name, Component]) => ({
    key: `/functions/${name}`,
    label: name,
    path: `/functions/${name}`,
    component: Component
}))

// 初始化菜单数据
export const initialMenuItems: MenuItem[] = [
    {
        key: 'functions',
        label: '功能组件',
        path: '/functions',
        children: FunctionMenuItems
    },
    {
        key: 'pages',
        label: '页面功能',
        path: '/pages',
        children: [
            {
                key: '/pages/ai-chat',
                label: 'AI聊天',
                path: '/pages/ai-chat',
                component: allComponents.AIChat
            }
        ]
    }
]

const initialState: SidebarState = {
  initSelectedItem: '/pages/ai-chat',
  selectedItem: '',
  expandedItems: initialMenuItems.map(item => item.key),
  menuItems: initialMenuItems,
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = action.payload
    },
    setExpandedItems: (state, action: PayloadAction<string[]>) => {
      state.expandedItems = action.payload
    },
    toggleExpandedItem: (state, action: PayloadAction<string>) => {
      const index = state.expandedItems.indexOf(action.payload)
      if (index === -1) {
        state.expandedItems.push(action.payload)
      } else {
        state.expandedItems.splice(index, 1)
      }
    },
  },
})

export const { setSelectedItem, setExpandedItems, toggleExpandedItem } = sidebarSlice.actions
export default sidebarSlice.reducer