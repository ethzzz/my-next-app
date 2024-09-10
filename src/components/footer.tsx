import styles from "./footer.module.scss"
import {
    HomeOutlined,
    BulbOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import { useNavigate } from "react-router-dom";

const footerItems = [
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
    const navigate = useNavigate()
    const tabClick = (item:any) =>{
        navigate(item.path,{state: { fromHome: true}})
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