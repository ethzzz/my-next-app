import { io, Socket } from 'socket.io-client';

class SocketClient {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout = 3000;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        try {
            this.socket = io(this.url, {
                path: '/api/socket',
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectTimeout,
                transports: ['websocket', 'polling'],
                autoConnect: true
            });
            
            this.socket.on('connect', () => {
                console.log('Socket connected');
                this.reconnectAttempts = 0;
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            this.socket.on('connect_error', (error: Error) => {
                console.error('Socket connection error:', error);
            });

        } catch (error) {
            console.error('Socket connection error:', error);
        }
    }

    send(type: string, data: any) {
        if (this.socket?.connected) {
            this.socket.emit(type, data);
        }
    }

    onMessage(type: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(type, callback);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketClient = new SocketClient('http://127.0.0.1:8888'); 