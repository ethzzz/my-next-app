'use client'
import React, { useRef, useState, useEffect } from 'react';
import { 
  Input, 
  Button, 
  Select, 
  Table, 
  message, 
  Space, 
  Typography, 
  Modal, 
  Spin,
  Upload,
  Progress,
  Tag,
  DatePicker,
  Form,
  Card,
  Row,
  Col,
  Divider,
  Tooltip,
  Badge
} from 'antd';
import { 
  UploadOutlined, 
  SearchOutlined, 
  FileOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import styles from './file-upload.module.scss';
import { RcFile } from 'antd/es/upload';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// 上传方式枚举
enum UploadMethod {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  CHUNK = 'chunk',
  RESUME = 'resume'
}

// 上传状态枚举
enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAILED = 'failed',
  PAUSED = 'paused'
}

// 文件记录接口
interface FileRecord {
  id: string;
  fileName: string;
  fileSize: number;
  uploadMethod: UploadMethod;
  uploadStatus: UploadStatus;
  uploadTime: string;
  progress: number;
  errorMessage?: string;
  fileType: string;
  fileUrl?: string;
}

// 上传文件接口
interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress: number;
  originFileObj: File;
  chunkList?: Blob[];
  currentChunk?: number;
  totalChunks?: number;
}

export function FileUpload() {
  // 搜索表单状态
  const [searchForm] = Form.useForm();
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>(UploadMethod.SINGLE);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 上传相关状态
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [chunkSize, setChunkSize] = useState(1024 * 1024); // 1MB chunks

  // 文件记录状态
  const [fileRecords, setFileRecords] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 拖拽上传状态
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载文件记录
  const loadFileRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      if (data.success) {
        setFileRecords(data.data);
      }
    } catch (error) {
      console.error('加载文件记录失败:', error);
      message.error('加载文件记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFileRecords();
  }, []);

  // 搜索记录
  const handleSearch = async () => {
    const values = searchForm.getFieldsValue();
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (values.keyword) params.append('keyword', values.keyword);
      if (values.uploadMethod) params.append('uploadMethod', values.uploadMethod);
      if (dateRange) {
        params.append('startDate', dateRange[0]);
        params.append('endDate', dateRange[1]);
      }
      
      const response = await fetch(`/api/upload?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setFileRecords(data.data);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setDateRange(null);
    setSearchKeyword('');
    loadFileRecords(); // 重新加载所有记录
  };

  // 打开上传窗口
  const showUploadModal = () => {
    setUploadModalVisible(true);
  };

  // 关闭上传窗口
  const handleUploadModalCancel = () => {
    setUploadModalVisible(false);
    setUploadFiles([]);
  };

  // 文件选择处理
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      uid: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: UploadStatus.PENDING,
      progress: 0,
      originFileObj: file
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // 删除文件
  const removeFile = (uid: string) => {
    setUploadFiles(prev => prev.filter(file => file.uid !== uid));
  };

  // 开始上传
  const startUpload = async () => {
    if (uploadFiles.length === 0) {
      message.warning('请选择要上传的文件');
      return;
    }

    setUploading(true);

    for (const file of uploadFiles) {
      try {
        await uploadFile(file);
      } catch (error) {
        console.error('上传失败:', error);
        message.error(`${file.name} 上传失败`);
      }
    }

    setUploading(false);
    message.success('上传完成');
    setUploadModalVisible(false);
    setUploadFiles([]);
  };

  // 上传单个文件
  const uploadFile = async (file: UploadFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file.originFileObj);
      formData.append('uploadMethod', uploadMethod);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadFiles(prev => 
            prev.map(f => 
              f.uid === file.uid 
                ? { ...f, status: UploadStatus.UPLOADING, progress }
                : f
            )
          );
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setUploadFiles(prev => 
            prev.map(f => 
              f.uid === file.uid 
                ? { ...f, status: UploadStatus.SUCCESS, progress: 100 }
                : f
            )
          );
          resolve();
        } else {
          setUploadFiles(prev => 
            prev.map(f => 
              f.uid === file.uid 
                ? { ...f, status: UploadStatus.FAILED, progress: 0 }
                : f
            )
          );
          reject(new Error('上传失败'));
        }
      });

      xhr.addEventListener('error', () => {
        setUploadFiles(prev => 
          prev.map(f => 
            f.uid === file.uid 
              ? { ...f, status: UploadStatus.FAILED, progress: 0 }
              : f
          )
        );
        reject(new Error('网络错误'));
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  // 分片上传
  const uploadChunk = async (file: UploadFile): Promise<void> => {
    const chunks = Math.ceil(file.size / chunkSize);
    const chunkList: Blob[] = [];
    
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.originFileObj.slice(start, end);
      chunkList.push(chunk);
    }

    setUploadFiles(prev => 
      prev.map(f => 
        f.uid === file.uid 
          ? { ...f, chunkList, totalChunks: chunks, currentChunk: 0 }
          : f
      )
    );

    // 模拟分片上传
    for (let i = 0; i < chunks; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const progress = ((i + 1) / chunks) * 100;
      
      setUploadFiles(prev => 
        prev.map(f => 
          f.uid === file.uid 
            ? { ...f, currentChunk: i + 1, progress }
            : f
        )
      );
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: FileRecord) => (
        <Space>
          <FileOutlined />
          <Text>{text}</Text>
          {record.uploadStatus === UploadStatus.SUCCESS && (
            <Tooltip title="下载文件">
              <DownloadOutlined style={{ color: '#52c41a', cursor: 'pointer' }} />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`
    },
    {
      title: '上传方式',
      dataIndex: 'uploadMethod',
      key: 'uploadMethod',
      render: (method: UploadMethod) => {
        const methodMap = {
          [UploadMethod.SINGLE]: '单文件上传',
          [UploadMethod.MULTIPLE]: '多文件上传',
          [UploadMethod.CHUNK]: '分片上传',
          [UploadMethod.RESUME]: '断点续传'
        };
        return <Tag color="blue">{methodMap[method]}</Tag>;
      }
    },
    {
      title: '上传状态',
      dataIndex: 'uploadStatus',
      key: 'uploadStatus',
      render: (status: UploadStatus, record: FileRecord) => {
        const statusConfig = {
          [UploadStatus.PENDING]: { color: 'default', icon: <ClockCircleOutlined />, text: '等待中' },
          [UploadStatus.UPLOADING]: { color: 'processing', icon: <CloudUploadOutlined />, text: '上传中' },
          [UploadStatus.SUCCESS]: { color: 'success', icon: <CheckCircleOutlined />, text: '成功' },
          [UploadStatus.FAILED]: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
          [UploadStatus.PAUSED]: { color: 'warning', icon: <PauseCircleOutlined />, text: '已暂停' }
        };
        
        const config = statusConfig[status];
        return (
          <Space>
            <Badge status={config.color as any} />
            {config.icon}
            <Text>{config.text}</Text>
            {status === UploadStatus.FAILED && record.errorMessage && (
              <Tooltip title={record.errorMessage}>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              </Tooltip>
            )}
          </Space>
        );
      }
    },
    {
      title: '上传进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      )
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FileRecord) => (
        <Space>
          {record.uploadStatus === UploadStatus.FAILED && (
            <Button type="link" size="small" icon={<ReloadOutlined />}>
              重试
            </Button>
          )}
          {record.uploadStatus === UploadStatus.SUCCESS && (
            <Button type="link" size="small" icon={<EyeOutlined />}>
              预览
            </Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.fileUploadContainer}>
      {/* 搜索表单区域 */}
      <Card className={styles.searchFormArea}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%', marginBottom: '20px' }}>
            <Col span={6}>
              <Form.Item name="keyword" label="文件名">
                <Input
                  placeholder="搜索文件名" 
                  prefix={<SearchOutlined />}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="uploadMethod" label="上传方式">
                <Select
                  placeholder="选择上传方式"
                  value={uploadMethod}
                  onChange={setUploadMethod}
                  options={[
                    { label: '单文件上传', value: UploadMethod.SINGLE },
                    { label: '多文件上传', value: UploadMethod.MULTIPLE },
                    { label: '分片上传', value: UploadMethod.CHUNK },
                    { label: '断点续传', value: UploadMethod.RESUME }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateRange" label="上传时间">
                <RangePicker 
                  placeholder={['开始时间', '结束时间']}
                  onChange={(dates) => setDateRange(dates as any)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ width: '100%'}}>
            <Col span={24}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" icon={<UploadOutlined />} onClick={showUploadModal}>
                  上传文件
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 文件记录列表 */}
      <Card className={styles.fileListArea}>
        <Table
          columns={columns}
          dataSource={fileRecords}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys: any) => setSelectedRowKeys(keys as string[])
          }}
          pagination={{
            total: fileRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 上传窗口 */}
      <Modal
        title="文件上传"
        open={uploadModalVisible}
        onCancel={handleUploadModalCancel}
        footer={[
          <Button key="cancel" onClick={handleUploadModalCancel}>
            取消
          </Button>,
          <Button 
            key="upload" 
            type="primary" 
            loading={uploading}
            onClick={startUpload}
          >
            开始上传
          </Button>
        ]}
        width={800}
      >
        <div className={styles.uploadArea}>
          {/* 上传方式选择 */}
          <div className={styles.uploadMethodSelect}>
            <Text strong>上传方式：</Text>
            <Select
              value={uploadMethod}
              onChange={setUploadMethod}
              style={{ width: 200 }}
              options={[
                { label: '单文件上传', value: UploadMethod.SINGLE },
                { label: '多文件上传', value: UploadMethod.MULTIPLE },
                { label: '分片上传', value: UploadMethod.CHUNK },
                { label: '断点续传', value: UploadMethod.RESUME }
              ]}
            />
          </div>

          {/* 文件选择区域 */}
          <div 
            className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <div className={styles.dropZoneContent}>
              <CloudUploadOutlined className={styles.uploadIcon} />
              <Text>点击或拖拽文件到此处上传</Text>
              <Text type="secondary">支持单个或多个文件</Text>
            </div>
          </div>

          {/* 文件列表 */}
          {uploadFiles.length > 0 && (
            <div className={styles.fileList}>
              <Divider>待上传文件</Divider>
              {uploadFiles.map(file => (
                <div key={file.uid} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <FileOutlined />
                    <Text>{file.name}</Text>
                    <Text type="secondary">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Text>
                  </div>
                  <div className={styles.fileProgress}>
                    <Progress percent={file.progress} size="small" />
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFile(file.uid)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

FileUpload.displayName = 'FileUpload'; 