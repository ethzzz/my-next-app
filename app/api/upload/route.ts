import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadMethod = formData.get('uploadMethod') as string;
    const chunkIndex = formData.get('chunkIndex') as string;
    const totalChunks = formData.get('totalChunks') as string;

    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      );
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = join(uploadDir, fileName);

    // 处理不同类型的上传
    if (uploadMethod === 'chunk' && chunkIndex && totalChunks) {
      // 分片上传
      const chunkDir = join(uploadDir, `${timestamp}_chunks`);
      if (!existsSync(chunkDir)) {
        await mkdir(chunkDir, { recursive: true });
      }

      const chunkPath = join(chunkDir, `chunk_${chunkIndex}`);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(chunkPath, buffer);

      // 检查是否所有分片都已上传
      const chunkIndexNum = parseInt(chunkIndex);
      const totalChunksNum = parseInt(totalChunks);
      
      if (chunkIndexNum === totalChunksNum - 1) {
        // 合并所有分片
        let finalBuffer = Buffer.concat([]);
        for (let i = 0; i < totalChunksNum; i++) {
          const chunkPath = join(chunkDir, `chunk_${i}`);
          const chunkBuffer = await readFile(chunkPath);
          finalBuffer = Buffer.concat([finalBuffer, chunkBuffer]);
        }
        
        await writeFile(filePath, finalBuffer);
        
        // 清理分片文件
        for (let i = 0; i < totalChunksNum; i++) {
          const chunkPath = join(chunkDir, `chunk_${i}`);
          await unlink(chunkPath);
        }
        await rmdir(chunkDir);
      }

      return NextResponse.json({
        success: true,
        message: `分片 ${chunkIndex} 上传成功`,
        fileName,
        fileUrl: `/uploads/${fileName}`
      });
    } else {
      // 普通上传
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: '文件上传成功',
        fileName,
        fileUrl: `/uploads/${fileName}`,
        fileSize: file.size
      });
    }
  } catch (error) {
    console.error('文件上传错误:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const uploadMethod = searchParams.get('uploadMethod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 这里应该从数据库查询文件记录
    // 现在返回模拟数据
    const mockRecords = [
      {
        id: '1',
        fileName: 'document.pdf',
        fileSize: 2048576,
        uploadMethod: 'single',
        uploadStatus: 'success',
        uploadTime: '2024-01-15 10:30:00',
        progress: 100,
        fileType: 'pdf',
        fileUrl: '/uploads/document.pdf'
      },
      {
        id: '2',
        fileName: 'image.jpg',
        fileSize: 1048576,
        uploadMethod: 'chunk',
        uploadStatus: 'failed',
        uploadTime: '2024-01-15 09:15:00',
        progress: 45,
        errorMessage: '网络连接中断',
        fileType: 'jpg'
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockRecords,
      total: mockRecords.length
    });
  } catch (error) {
    console.error('获取文件记录错误:', error);
    return NextResponse.json(
      { error: '获取文件记录失败' },
      { status: 500 }
    );
  }
} 