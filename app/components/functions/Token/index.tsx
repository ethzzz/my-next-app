import { FunctionItem, FunctionItemHeader, FunctionItemContent} from "../../function-item";
import { Button, Input, message, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { socketClient } from "../../../utils/websocket";
import styles from './Token.module.scss';
import dayjs from 'dayjs';

const { Text } = Typography;

interface TokenInfo {
    token: string;
    expiresAt: number;
}

const TOKEN_EXPIRY_OPTIONS = [
    { label: '1分钟', value: 60 },
    { label: '5分钟', value: 300 },
    { label: '10分钟', value: 600 },
    { label: '30分钟', value: 1800 },
    { label: '1小时', value: 3600 },
    { label: '24小时', value: 86400 },
    { label: '7天', value: 604800 },
    { label: '30天', value: 2592000 },
];

export function Token() {
    const [token, setToken] = useState<string>('');
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [selectedExpiry, setSelectedExpiry] = useState<number>(3600);
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        // 连接 WebSocket
        socketClient.connect();

        // 监听 WebSocket 消息
        socketClient.onMessage('message', (data:any) => {
            data = JSON.parse(data);
            if (data.type === 'token') {
                setTokenInfo({
                    token: data.token,
                    expiresAt: data.expiresAt
                });
                setToken(data.token);
            }
            if (data.type === 'tokenVerification') {
                if(data.valid){
                    message.success('Token 验证成功');
                }else{
                    message.error('Token 验证失败');
                }
            }
        });

        return () => {
            socketClient.disconnect();
        };
    }, []);

    // 更新倒计时
    useEffect(() => {
        if (!tokenInfo) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const timeLeft = tokenInfo.expiresAt - now;

            if (timeLeft <= 0) {
                setTimeLeft('已过期');
                clearInterval(timer);
                return;
            }

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}时${minutes}分${seconds}秒`);
        }, 1000);

        return () => clearInterval(timer);
    }, [tokenInfo]);

    const handleGetToken = () => {
        socketClient.send('message', {
            type: 'getToken',
            expiry: selectedExpiry
        });
    };

    const handleVerifyToken = () => {
        socketClient.send('message', {
            type: 'verifyToken',
            token
        });
    };

    const handleClearToken = () => {
        setToken('');
        setTokenInfo(null);
        setTimeLeft('');
    };

    return (
        <FunctionItem>
            <FunctionItemHeader>Token 管理</FunctionItemHeader>
            <FunctionItemContent>
                <div className={styles.tokenContainer}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div className={styles.tokenInputGroup}>
                            {/* 移入鼠标显示完整的token，通过html属性实现 */}
                            <div className={styles.token} title={tokenInfo?.token} >
                                {tokenInfo?.token}
                            </div>
                            {
                                tokenInfo?.expiresAt && (
                                    <Text className={styles.timeLeft}>
                                        有效时间截止到: {dayjs(tokenInfo?.expiresAt).format('YYYY-MM-DD HH:mm:ss')}
                                    </Text>
                                )
                            }
                            {timeLeft && (
                                <Text className={styles.timeLeft}>
                                    有效时间: {timeLeft}
                                </Text>
                            )}
                        </div>
                        
                        <div className={styles.controls}>
                            <Select
                                value={selectedExpiry}
                                onChange={setSelectedExpiry}
                                options={TOKEN_EXPIRY_OPTIONS}
                                style={{ width: 120 }}
                            />
                            <Space>
                                <Button type="primary" onClick={handleGetToken}>
                                    获取 Token
                                </Button>
                                <Button onClick={handleVerifyToken}>
                                    验证 Token
                                </Button>
                                <Button danger onClick={handleClearToken}>
                                    清除 Token
                                </Button>
                            </Space>
                        </div>
                    </Space>
                </div>
            </FunctionItemContent>
        </FunctionItem>
    );
}

Token.displayName = "Token";