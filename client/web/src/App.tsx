import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, Progress, Typography, Space, Statistic } from 'antd';
import { 
  DownloadOutlined, 
  UploadOutlined, 
  WalletOutlined, 
  ThunderboltOutlined,
  NodeIndexOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import TorrentManager from './components/TorrentManager.tsx';
import WalletPanel from './components/WalletPanel.tsx';
import SpeedDashboard from './components/SpeedDashboard.tsx';
import SuperNodePanel from './components/SuperNodePanel.tsx';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface NetworkStats {
  totalUsers: number;
  totalNodes: number;
  totalData: number;
  avgSpeed: number;
  tokenPrice: number;
}

interface UserStats {
  balance: number;
  staked: number;
  uploaded: number;
  downloaded: number;
  earnings: number;
}

const App: React.FC = () => {
  const [connected] = useState(true); // Mock connection state
  const [activeTab, setActiveTab] = useState('downloads');
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalUsers: 25847,
    totalNodes: 1243,
    totalData: 847.5, // TB
    avgSpeed: 45.2, // MB/s
    tokenPrice: 0.0095, // USD
  });
  
  const [userStats, setUserStats] = useState<UserStats>({
    balance: 1250.5,
    staked: 10000,
    uploaded: 156.8, // GB
    downloaded: 892.4, // GB
    earnings: 12.75, // USD
  });

  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    // 模拟实时数据更新
    const interval = setInterval(() => {
      setCurrentSpeed(Math.random() * 80 + 20);
      setDownloadProgress(prev => (prev + Math.random() * 5) % 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { key: 'downloads', icon: <DownloadOutlined />, label: '下载管理' },
    { key: 'dashboard', icon: <DashboardOutlined />, label: '速度仪表盘' },
    { key: 'wallet', icon: <WalletOutlined />, label: 'TF钱包' },
    { key: 'supernode', icon: <NodeIndexOutlined />, label: '超级节点' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'downloads':
        return <TorrentManager userBalance={userStats.balance} />;
      case 'dashboard':
        return <SpeedDashboard currentSpeed={currentSpeed} networkStats={networkStats} />;
      case 'wallet':
        return <WalletPanel userStats={userStats} tokenPrice={networkStats.tokenPrice} />;
      case 'supernode':
        return <SuperNodePanel userStats={userStats} />;
      default:
        return <TorrentManager userBalance={userStats.balance} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThunderboltOutlined style={{ fontSize: '24px', color: 'white', marginRight: '12px' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            ThunderFuel Network
          </Title>
        </div>
        
        <Space>
          <Text style={{ color: 'white' }}>
            网络速度: {networkStats.avgSpeed} MB/s
          </Text>
          <Text style={{ color: 'white' }}>
            TF价格: ${networkStats.tokenPrice}
          </Text>
          <Button type="primary" ghost>
            连接钱包 (模拟)
          </Button>
        </Space>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider width={250} style={{ background: '#f0f2f5' }}>
          <div style={{ padding: '16px' }}>
            {/* 网络统计卡片 */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic
                  title="网络用户"
                  value={networkStats.totalUsers}
                  suffix="人"
                  valueStyle={{ fontSize: '14px' }}
                />
                <Statistic
                  title="超级节点"
                  value={networkStats.totalNodes}
                  suffix="个"
                  valueStyle={{ fontSize: '14px' }}
                />
                <Statistic
                  title="总共享量"
                  value={networkStats.totalData}
                  suffix="TB"
                  valueStyle={{ fontSize: '14px' }}
                />
              </Space>
            </Card>

            {/* 用户统计卡片 */}
            {connected && (
              <Card size="small" style={{ marginBottom: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic
                    title="TF余额"
                    value={userStats.balance}
                    suffix="TF"
                    valueStyle={{ fontSize: '14px', color: '#1890ff' }}
                  />
                  <Statistic
                    title="今日收益"
                    value={userStats.earnings}
                    prefix="$"
                    valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                  />
                  <Progress
                    type="circle"
                    size={60}
                    percent={Math.round((userStats.uploaded / (userStats.uploaded + userStats.downloaded)) * 100)}
                    format={() => '上传率'}
                  />
                </Space>
              </Card>
            )}

            {/* 菜单导航 */}
            <div>
              {menuItems.map(item => (
                <Button
                  key={item.key}
                  type={activeTab === item.key ? 'primary' : 'text'}
                  icon={item.icon}
                  style={{ 
                    width: '100%', 
                    textAlign: 'left', 
                    marginBottom: '8px',
                    height: '40px'
                  }}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* 一键加速按钮 */}
            {connected && (
              <Card 
                size="small" 
                style={{ 
                  marginTop: '16px',
                  background: 'linear-gradient(45deg, #ff4d4f, #ff7a45)',
                  color: 'white'
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    一键加速
                  </Text>
                  <Button 
                    type="primary" 
                    danger 
                    icon={<ThunderboltOutlined />}
                    style={{ width: '100%' }}
                    disabled={userStats.balance < 10}
                  >
                    消耗10TF加速
                  </Button>
                  <Text style={{ color: 'white', fontSize: '12px' }}>
                    瞬间提升300%下载速度
                  </Text>
                </Space>
              </Card>
            )}
          </div>
        </Sider>

        {/* Main Content */}
        <Layout style={{ padding: '24px' }}>
          <Content>
            {!connected ? (
              // 未连接钱包时的欢迎页面
              <div style={{ 
                textAlign: 'center', 
                padding: '100px 20px',
                background: 'white',
                borderRadius: '8px'
              }}>
                <ThunderboltOutlined style={{ fontSize: '72px', color: '#1890ff' }} />
                <Title level={1}>欢迎来到 ThunderFuel</Title>
                <Title level={3} type="secondary">
                  下一代区块链驱动的P2P加速网络
                </Title>
                <Space direction="vertical" size="large" style={{ marginTop: '40px' }}>
                  <Row gutter={24} justify="center">
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="下载速度提升"
                          value={371}
                          suffix="%"
                          valueStyle={{ color: '#cf1322' }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="用户收益"
                          value={2.5}
                          prefix="$"
                          suffix="/日"
                          valueStyle={{ color: '#3f8600' }}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="网络节点"
                          value={networkStats.totalNodes}
                          suffix="个"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  <div style={{ marginTop: '40px' }}>
                    <Text style={{ fontSize: '16px', marginBottom: '20px', display: 'block' }}>
                      连接钱包开始体验超高速下载
                    </Text>
                    <Button type="primary" size="large">
                      连接钱包 (演示模式)
                    </Button>
                  </div>
                </Space>
              </div>
            ) : (
              renderContent()
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
