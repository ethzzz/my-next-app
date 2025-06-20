import React, { useRef, useState } from 'react';
import { Input, Button, Select, Upload, message, Space, Typography } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import styles from './ai-chat.module.scss';

const { TextArea } = Input;
const { Text } = Typography;

const MODELS = [
  { label: 'GPT-3.5', value: 'gpt-3.5' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: '文心一言', value: 'wenxin' },
];

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  imageUrl?: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-3.5');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    // 模拟AI回复
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { role: 'ai', content: `（${model}）AI回复: ${userMsg.content}` },
      ]);
      setLoading(false);
    }, 1000);
  };

  // 粘贴图片
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) handleImage(file);
      }
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
        { role: 'user', content: '[图片]', imageUrl: e.target?.result as string },
        { role: 'ai', content: 'AI暂不支持图片理解。' },
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

  return (
    <div className={styles.chatContainer} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
      <div className={styles.chatHistory}>
        {messages.length === 0 && <Text type="secondary">暂无聊天内容</Text>}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
            {msg.imageUrl && <img src={msg.imageUrl} alt="用户图片" className={styles.chatImg} />}
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <div className={styles.chatInputArea}>
        <Space style={{ width: '100%' }} direction="vertical">
          <Select
            value={model}
            onChange={setModel}
            options={MODELS}
            style={{ width: 160 }}
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
          <div className={styles.inputActions}>
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
              disabled={!input.trim()}
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