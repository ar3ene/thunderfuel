import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Progress, 
  Space, 
  Tag, 
  Typography, 
  Modal, 
  Row, 
  Col,
  Statistic,
  message
} from 'antd';
import { 
  DownloadOutlined, 
  PauseOutlined, 
  PlayCircleOutlined,
  DeleteOutlined,
  FileOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

interface TorrentFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  speed: number;
  status: 'downloading' | 'seeding' | 'paused' | 'completed';
  peers: number;
  seeds: number;
  eta: string;
  uploaded: number;
  ratio: number;
  tfEarned: number;
}

interface Props {
  userBalance: number;
}

const TorrentManager: React.FC<Props> = ({ userBalance }) => {
  const [torrents, setTorrents] = useState<TorrentFile[]>([
    {
      id: '1',
      name: '2023年最新电影合集 4K HDR',
      size: 45.6, // GB
      progress: 67,
      speed: 15.8, // MB/s
      status: 'downloading',
      peers: 28,
      seeds: 12,
      eta: '1h 23m',
      uploaded: 8.2,
      ratio: 0.18,
      tfEarned: 16.4
    },
    {
      id: '2', 
      name: 'Linux发行版镜像集合',
      size: 12.3,
      progress: 100,
      speed: 0,
      status: 'seeding',
      peers: 45,
      seeds: 8,
      eta: '完成',
      uploaded: 28.7,
      ratio: 2.33,
      tfEarned: 57.4
    },
    {
      id: '3',
      name: '编程教程合集 - Python深度学习',
      size: 8.9,
      progress: 34,
      speed: 3.2,
      status: 'downloading',
      peers: 12,
      seeds: 4,
      eta: '2h 45m',
      uploaded: 1.1,
      ratio: 0.13,
      tfEarned: 2.2
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [magnetLink, setMagnetLink] = useState('');
  const [speedBoostModal, setSpeedBoostModal] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<TorrentFile | null>(null);

  const handleAddTorrent = useCallback(() => {
    if (!magnetLink.trim()) {
      message.error('请输入有效的磁力链接或种子文件');
      return;
    }
    
    // 模拟添加种子
    const newTorrent: TorrentFile = {
      id: Date.now().toString(),
      name: '新的下载任务',
      size: Math.random() * 20 + 1,
      progress: 0,
      speed: 0,
      status: 'downloading',
      peers: 0,
      seeds: 0,
      eta: '计算中...',
      uploaded: 0,
      ratio: 0,
      tfEarned: 0
    };
    
    setTorrents(prev => [...prev, newTorrent]);
    setMagnetLink('');
    setShowAddModal(false);
    message.success('种子已添加到下载队列');
  }, [magnetLink]);

  const handleSpeedBoost = useCallback((torrent: TorrentFile) => {
    if (userBalance < 10) {
      message.error('TF余额不足，需要至少10 TF');
      return;
    }
    
    // 模拟加速
    setTorrents(prev => prev.map(t => 
      t.id === torrent.id 
        ? { ...t, speed: t.speed * 3 }
        : t
    ));
    
    message.success('加速成功！下载速度提升300%');
    setSpeedBoostModal(false);
  }, [userBalance]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloading': return 'blue';
      case 'seeding': return 'green';
      case 'paused': return 'orange';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'downloading': return '下载中';
      case 'seeding': return '做种中';
      case 'paused': return '已暂停';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text: string) => (
        <Space>
          <FileOutlined />
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => `${size.toFixed(1)} GB`,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small"
          status={progress === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: '速度',
      dataIndex: 'speed',
      key: 'speed',
      width: 100,
      render: (speed: number) => (
        <Text style={{ color: speed > 0 ? '#52c41a' : '#999' }}>
          {speed > 0 ? `${speed.toFixed(1)} MB/s` : '--'}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '连接数',
      key: 'connections',
      width: 100,
      render: (record: TorrentFile) => (
        <Text>{record.peers + record.seeds}</Text>
      ),
    },
    {
      title: 'TF收益',
      dataIndex: 'tfEarned',
      key: 'tfEarned',
      width: 100,
      render: (earned: number) => (
        <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
          +{earned.toFixed(1)} TF
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (record: TorrentFile) => (
        <Space>
          {record.status === 'downloading' ? (
            <Button size="small" icon={<PauseOutlined />} />
          ) : record.status === 'paused' ? (
            <Button size="small" icon={<PlayCircleOutlined />} type="primary" />
          ) : null}
          
          <Button 
            size="small" 
            icon={<ThunderboltOutlined />}
            type="primary"
            danger
            disabled={userBalance < 10 || record.status !== 'downloading'}
            onClick={() => {
              setSelectedTorrent(record);
              setSpeedBoostModal(true);
            }}
          >
            加速
          </Button>
          
          <Button 
            size="small" 
            icon={<DeleteOutlined />}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 头部统计 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="下载中"
              value={torrents.filter(t => t.status === 'downloading').length}
              suffix="个任务"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总下载速度"
              value={torrents.reduce((sum, t) => sum + t.speed, 0).toFixed(1)}
              suffix="MB/s"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日收益"
              value={torrents.reduce((sum, t) => sum + t.tfEarned, 0).toFixed(1)}
              suffix="TF"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="上传比率"
              value={(torrents.reduce((sum, t) => sum + t.ratio, 0) / torrents.length).toFixed(2)}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 工具栏 */}
      <Card style={{ marginBottom: '16px' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => setShowAddModal(true)}
            >
              添加种子
            </Button>
            <Search
              placeholder="搜索资源..."
              style={{ width: 300 }}
              onSearch={(value) => console.log('搜索:', value)}
            />
          </Space>
          
          <Space>
            <Text>TF余额: </Text>
            <Text strong style={{ color: '#1890ff' }}>{userBalance.toFixed(1)} TF</Text>
          </Space>
        </Space>
      </Card>

      {/* 种子列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={torrents}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 添加种子对话框 */}
      <Modal
        title="添加新的下载任务"
        open={showAddModal}
        onOk={handleAddTorrent}
        onCancel={() => setShowAddModal(false)}
        okText="添加"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>支持磁力链接(magnet:)或种子文件(.torrent)</Text>
          <Input.TextArea
            rows={4}
            placeholder="magnet:?xt=urn:btih:..."
            value={magnetLink}
            onChange={(e) => setMagnetLink(e.target.value)}
          />
        </Space>
      </Modal>

      {/* 加速确认对话框 */}
      <Modal
        title="确认使用TF加速"
        open={speedBoostModal}
        onOk={() => selectedTorrent && handleSpeedBoost(selectedTorrent)}
        onCancel={() => setSpeedBoostModal(false)}
        okText="确认加速"
        cancelText="取消"
      >
        {selectedTorrent && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>文件名: <Text strong>{selectedTorrent.name}</Text></Text>
            <Text>当前速度: <Text strong>{selectedTorrent.speed.toFixed(1)} MB/s</Text></Text>
            <Text>加速后: <Text strong style={{ color: '#52c41a' }}>
              {(selectedTorrent.speed * 3).toFixed(1)} MB/s
            </Text></Text>
            <Text>消耗: <Text strong style={{ color: '#ff4d4f' }}>10 TF</Text></Text>
            <Text type="secondary">当前余额: {userBalance.toFixed(1)} TF</Text>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default TorrentManager;
