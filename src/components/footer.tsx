import styles from "./footer.module.scss"
import {
    HomeOutlined,
    BulbOutlined,
    UserOutlined,
} from "@ant-design/icons";

const footerItems = [
    {
        name: 'home',
        activeIcon: <HomeOutlined />,
        unActiveIcon: <HomeOutlined />
    },
    {
        name:'about',
        activeIcon: <BulbOutlined />,
        unActiveIcon: <BulbOutlined />
    },
    {
        name: 'user',
        activeIcon: <UserOutlined />,
        unActiveIcon: <UserOutlined />
    }
]

export function Footer(){
    return (
        <div className={styles['footer']}>
            {footerItems.map((item, index) => {
                return (
                    <div className={styles['footer-item']}>
                        <span className={styles['footer-item-icon']}>{item.unActiveIcon}</span>
                        <span className={styles['footer-item-text']}>{item.name}</span>
                    </div>
                )
            })}
        </div>
    )
}