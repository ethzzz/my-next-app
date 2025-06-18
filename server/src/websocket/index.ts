import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketMessageType } from '../../types/websocket';
import { createServer } from 'http';

const JWT_SECRET = 'your-secret-key';
const tokenStore = new Map<string, { token: string; expiresAt: number }>();

// 创建 HTTP 服务器
const httpServer = createServer();

// 创建 Socket.IO 服务器
const wss = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    path: '/api/socket',
    transports: ['websocket', 'polling'],
});

interface WebSocketMessage {
    type: WebSocketMessageType;
    expiry?: number;
    token?: string;
    data?: any;
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message: WebSocketMessage) => {
        try {
            const data = message as WebSocketMessage;
            
            switch (data.type) {
                case 'getToken': {
                    console.log('getToken', data);
                    const tokenId = uuidv4();
                    const expiresAt = Date.now() + (data.expiry || 3600) * 1000;
                    const token = jwt.sign({ id: tokenId }, JWT_SECRET, { expiresIn: data.expiry || 3600 });
                    
                    tokenStore.set(tokenId, { token, expiresAt });
                    
                    ws.send(JSON.stringify({
                        type: 'token',
                        token,
                        expiresAt
                    }));
                    break;
                }
                
                case 'verifyToken': {
                    if (!data.token) {
                        ws.send(JSON.stringify({
                            type: 'tokenVerification',
                            valid: false,
                            message: 'Token is required'
                        }));
                        return;
                    }

                    try {
                        const decoded = jwt.verify(data.token, JWT_SECRET) as { id: string };
                        const tokenInfo = tokenStore.get(decoded.id);
                        
                        if (!tokenInfo) {
                            ws.send(JSON.stringify({
                                type: 'tokenVerification',
                                valid: false,
                                message: 'Token not found'
                            }));
                            return;
                        }
                        
                        if (tokenInfo.expiresAt < Date.now()) {
                            ws.send(JSON.stringify({
                                type: 'tokenVerification',
                                valid: false,
                                message: 'Token expired'
                            }));
                            return;
                        }
                        
                        ws.send(JSON.stringify({
                            type: 'tokenVerification',
                            valid: true,
                            expiresAt: tokenInfo.expiresAt
                        }));
                    } catch (error) {
                        ws.send(JSON.stringify({
                            type: 'tokenVerification',
                            valid: false,
                            message: 'Invalid token'
                        }));
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 导出 HTTP 服务器实例
export { httpServer };