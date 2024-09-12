'use client'
import styles from './header.module.scss'
import { useUserStore } from '@/store/user'
import {
    useRef,
    useState
} from 'react'
import {
    Modal,
    Form,
    Input,
    FormInstance,
    message
} from 'antd'

export function Header() {
    const userStore = useUserStore()
    const { getUserInfo,setUserInfo,login } = userStore

    const user = getUserInfo()

    const Login = () =>{
        const [showLoginModal,setShowLoginModal] = useState(false)
        const handleShowLoginModal = (type: 'login' | 'setup') => {
            setShowLoginModal(true)
        }

        function LoginModal(){
            const formRef = useRef<FormInstance>(null)
            const handleLogin = ()=>{
                formRef.current?.validateFields().then(async(values)=>{
                    const { username,password } = values
                    try{
                        const res = await login(username,password)
                        if(res.code === 0){
                            return message.success('登录成功')
                        }else{
                            return message.error(res.msg)
                        }
                    }catch(err: any){
                        return message.error(err)
                    }
                })
            }
            return (
                <Modal title="Login" open={showLoginModal} onCancel={()=> setShowLoginModal(false)} onOk={()=> handleLogin()}>
                    <Form name="login" ref={formRef}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input type="text"/>
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input type="password"/>
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }

        return (
            <div className={styles['login-container']}>
                <div className={`${styles['button']} ${styles['login']}`} onClick={()=> handleShowLoginModal('login')}>Login</div>
                <div className={`${styles['button']} ${styles['setup']}`} onClick={()=> handleShowLoginModal('setup')}>Setup</div>
                { showLoginModal && (
                    <LoginModal />
                )}
            </div>
        )
    }

    const User = () =>{
        return (
            <>
                <div className={styles['user-info']}>
                    <span className={styles['username']}>{user.username}</span>
                </div>
            </>
        )
    }

    return (
        <div className={styles['header-content']}>
            {getUserInfo().isLogin ? <User /> : <Login /> }
        </div>
    )
}