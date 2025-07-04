import express, { Request, Response, RequestHandler, Router, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { httpServer } from './src/websocket/index';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const app = express();
const port = 8888;

// 中间件
app.use(cors());
app.use(express.json());

// JWT 配置
const JWT_SECRET = 'your-secret-key';
const tokenStore = new Map<string, { token: string; expiresAt: number }>();

interface TokenRequest {
    expiry?: number;
    token?: string;
}

const router = Router();

// 配置multer用于文件上传
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// HTTP API 路由
router.post('/api/token', (req: Request, res: Response) => {
    const { expiry = 3600 } = req.body;
    const tokenId = uuidv4();
    const expiresAt = Date.now() + expiry * 1000;
    
    const token = jwt.sign({ id: tokenId }, JWT_SECRET, { expiresIn: expiry });
    
    tokenStore.set(tokenId, { token, expiresAt });
    
    res.json({ token, expiresAt });
});

const verifyTokenHandler: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    
    if (!token) {
        res.status(400).json({ valid: false, message: 'Token is required' });
        return;
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const tokenInfo = tokenStore.get(decoded.id);
        
        if (!tokenInfo) {
            res.status(401).json({ valid: false, message: 'Token not found' });
            return;
        }
        
        if (tokenInfo.expiresAt < Date.now()) {
            res.status(401).json({ valid: false, message: 'Token expired' });
            return;
        }
        
        res.json({ valid: true, expiresAt: tokenInfo.expiresAt });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
};

const deleteTokenHandler: RequestHandler = (req, res, next) => {
    const { token } = req.body;
    
    if (!token) {
        res.status(400).json({ success: false, message: 'Token is required' });
        return;
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        tokenStore.delete(decoded.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};

router.post('/api/token/verify', verifyTokenHandler);
router.delete('/api/token', deleteTokenHandler);

// 上传图片接口
router.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const id = path.parse(file.filename).name;
  // 假设静态资源可通过 /uploads 访问
  const link = `/uploads/${file.filename}`;
  res.json({ link, name: file.originalname, id });
});

// 静态资源托管
app.use('/uploads', express.static(uploadDir));

app.use(router);

// 将 Express 应用挂载到 WebSocket 的 HTTP 服务器上
httpServer.on('request', app);

// 启动服务器
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 