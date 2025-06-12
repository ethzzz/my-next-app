'use client'
// src/store/slices/sidebarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as FunctionComponents from '@/components/functions';

interface MenuItem {
    key: string
    label: string
    path: string
    children?: MenuItem[]
}

interface SidebarState {
  selectedItem: string
  expandedItems: string[]
  menuItems: MenuItem[]
}

const FunctionMenuItems = Object.entries(FunctionComponents).map(([name]) => ({
    key: `/functions/${name}`,
    label: name,
    path: `/functions/${name}`,
}))

// 初始化菜单数据
const initialMenuItems: MenuItem[] = [
    {
        key: 'functions',
        label: '功能组件',
        path: '/functions',
        children: FunctionMenuItems
    }
]

const initialState: SidebarState = {
  selectedItem: '',
  expandedItems: [],
  menuItems: initialMenuItems
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