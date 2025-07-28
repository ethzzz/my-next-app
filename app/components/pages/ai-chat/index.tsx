'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Input, Button, Select, Upload, message, Space, Typography, Modal, Spin } from 'antd';
import { UploadOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './ai-chat.module.scss';
import { uploadImageApi, ImageInfo } from '@/app/utils/api';

const { TextArea } = Input;
const { Text } = Typography;

const MODELS = [
  { label: 'GPT-3.5', value: 'gpt-3.5' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: '文心一言', value: 'wenxin' },
];

interface ChatMessage {
  role: 'user' | 'ai';
  name: string;
  content: string;
  image?: ImageInfo[];
}

// 本地扩展类型用于处理上传中状态
interface ImageInfoWithStatus extends ImageInfo {
  status?: 'uploading' | 'done';
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-3.5');
  const [loading, setLoading] = useState(false);
  const [pastedImages, setPastedImages] = useState<ImageInfoWithStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modelList, setModelList] = useState(MODELS);

  useEffect(() => {
    fetch('/api/ai-chat')
      .then(res => res.json())
      .then(data => {
        if (data.models) setModelList(data.models);
      });
  }, []);

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() && pastedImages.length === 0) return;
    // 如果有图片，全部作为一条消息的图片（这里只用第一张做 imageUrl，实际可扩展为多张）
    const userMsg: ChatMessage = { role: 'user', name: '我', content: input, image: pastedImages };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setPastedImages([]);
    setLoading(true);
    try {
      // 只发送文本内容给AI，图片暂不处理
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, model }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((msgs) => [
          ...msgs,
          { role: 'ai', name: model, content: data.reply, image: undefined },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { role: 'ai', name: model, content: data.error || 'AI无回复', image: undefined },
        ]);
      }
    } catch (e: any) {
      setMessages((msgs) => [
        ...msgs,
        { role: 'ai', name: model, content: 'AI服务异常', image: undefined },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 粘贴图片
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (pastedImages.length >= 3) {
      message.warning('最多上传3张图片');
      return;
    }
    const items = e.clipboardData.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    // 限制最多3张
    const remain = 3 - pastedImages.length;
    const filesToUpload = files.slice(0, remain);
    if (filesToUpload.length > 0) {
      setUploading(true);
      // 先添加loading占位
      const loadingImgs: ImageInfoWithStatus[] = filesToUpload.map((file, idx) => ({
        link: '',
        name: file.name,
        id: `loading-${Date.now()}-${idx}`,
        status: 'uploading',
      }));
      setPastedImages((imgs) => [...imgs, ...loadingImgs]);
      // 并行上传
      const imgInfos = await Promise.all(filesToUpload.map(file => uploadImageApi(file)));
      setPastedImages((imgs) => {
        // 替换掉loading占位
        const newImgs = [...imgs];
        let loadingIdx = 0;
        for (let i = 0; i < newImgs.length; i++) {
          if (newImgs[i].status === 'uploading' && loadingIdx < imgInfos.length) {
            newImgs[i] = { ...imgInfos[loadingIdx], status: 'done' };
            loadingIdx++;
          }
        }
        return newImgs;
      });
      setUploading(false);
    }
  };

  // 拖拽图片
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) handleImage(files[0]);
  };

  // 处理图片
  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setMessages((msgs) => [
        ...msgs,
        { role: 'user', name: '我', content: '[图片]', image: undefined },
        { role: 'ai', name: model, content: 'AI暂不支持图片理解。' },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // 上传图片
  const handleUpload = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      handleImage(info.file.originFileObj);
    }
  };

  // 当容器出现滚动条时，自动滚动到底部
  const scrollToBottom = () => {
    const chatHistory = document.querySelector(`.${styles['chat-history']}`);
    if (chatHistory) {
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles['chat-container']} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
      <div className={styles['chat-history']}>
        {messages.length === 0 && <Text type="secondary">暂无聊天内容</Text>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles['chat-message-item']} ${msg.role === "user" ? styles['chat-message-user'] : styles['chat-message']} ${styles['chat-message-item']}`}
          >
            <div className={styles['chat-message-container']}>
              {msg.image && Array.isArray(msg.image) && msg.image.length > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    {msg.image.map(img => (
                      <img key={img.id} src={img.link} alt={img.name} className={styles['chat-img']} />
                    ))}
                  </div>
                </>
              ) : null}
              <div className={styles['chat-message-header']}></div>
              <div className={styles['chat-message-content']}>
                <span>{msg.content}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles['chat-input-area']}>
        <Space style={{ width: '100%' }} direction="vertical">
          <Select
            value={model}
            onChange={setModel}
            options={modelList.map(m => ({ label: m.label, value: m.value }))}
            style={{ width: 120, marginRight: 8 }}
          />
          <TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            onPaste={handlePaste}
            placeholder="请输入内容，支持粘贴图片或拖拽图片"
            autoSize={{ minRows: 2, maxRows: 6 }}
            disabled={loading}
          />
          {pastedImages.length > 0 && (
            <div style={{ margin: '8px 0', display: 'flex', gap: 8 }}>
              {pastedImages.map((img, idx) => (
                <div key={img.id} style={{ position: 'relative', display: 'inline-block' }}>
                  {img.status === 'uploading' ? (
                    <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 4, border: '1px solid #eee' }}>
                      <Spin />
                    </div>
                  ) : (
                    <div className={styles['chat-img-preview']} onClick={() => { setPreviewIndex(idx); setPreviewVisible(true); }} style={{ cursor: 'pointer' }}>
                      <span className={styles['chat-img-preview-index']} style={{ background: `url(${img.link}) no-repeat center center / cover` }} />
                    </div>
                  )}
                  <CloseOutlined
                    onClick={() => setPastedImages(pastedImages.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      color: '#fff',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      fontSize: 14,
                      cursor: 'pointer',
                      padding: 2,
                    }}
                  />
                </div>
              ))}
              <Modal
                open={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                width={600}
                style={{ textAlign: 'center' }}
              >
                {pastedImages[previewIndex] && (
                  <img src={pastedImages[previewIndex].link} alt={pastedImages[previewIndex].name} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                )}
                <div style={{ marginTop: 12 }}>
                  {pastedImages.length > 1 && pastedImages.map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.link}
                      alt={img.name}
                      style={{ width: 40, height: 40, objectFit: 'cover', margin: '0 4px', border: idx === previewIndex ? '2px solid #1890ff' : '1px solid #eee', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => setPreviewIndex(idx)}
                    />
                  ))}
                </div>
              </Modal>
            </div>
          )}
          <div className={styles['input-actions']}>
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              customRequest={() => {}}
              onChange={handleUpload}
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              loading={loading}
              disabled={(!input.trim()) || loading}
            >
              发送
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
}

AIChat.displayName = 'AIChat';