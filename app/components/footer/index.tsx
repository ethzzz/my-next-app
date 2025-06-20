'use client'
import styles from "./index.module.scss"
import {
    HomeOutlined,
    BulbOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface FooterItem {
    name: string;
    path : string;
    activeIcon: JSX.Element;
    unActiveIcon: JSX.Element;
}

const footerItems : FooterItem[] = [
    {
        name: 'home',
        path: 'home',
        activeIcon: <HomeOutlined />,
        unActiveIcon: <HomeOutlined />
    },
    {
        name:'about',
        path: 'about',
        activeIcon: <BulbOutlined />,
        unActiveIcon: <BulbOutlined />
    },
    {
        name: 'user',
        path: 'user',
        activeIcon: <UserOutlined />,
        unActiveIcon: <UserOutlined />
    }
]

export function Footer(){
    const router = useRouter()
    const tabClick = (item: FooterItem) =>{
        router.push(`/${item.path}`)
    }

    return (
        <div className={styles['footer']}>
            {footerItems.map((item, index) => {
                return (
                    <div className={styles['footer-item']} onClick={() => {tabClick(item)}} key={index}>
                        <span className={styles['footer-item-icon']}>{item.unActiveIcon}</span>
                        <span className={styles['footer-item-text']}>{item.name}</span>
                    </div>
                )
            })}
        </div>
    )
}