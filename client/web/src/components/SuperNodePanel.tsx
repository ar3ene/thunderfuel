import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  Typography, 
  Switch,
  Progress,
  Modal,
  Input,
  message,
  Alert
} from 'antd';
import { 
  NodeIndexOutlined, 
  DollarOutlined, 
  ThunderboltOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  userStats: {
    balance: number;
    staked: number;
    uploaded: number;
    downloaded: number;
    earnings: number;
  };
}

const SuperNodePanel: React.FC<Props> = ({ userStats }) => {
  const [isNodeRunning, setIsNodeRunning] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  // 模拟超级节点数据
  const nodeStats = {
    uptime: 98.5, // 在线率
    bandwidth: 156.8, // Mbps
    connections: 45, // 连接数
    dataServed: 892.4, // GB
    hoursOnline: 168, // 小时
    earnings: 840, // TF
  };

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (!amount || amount < 10000) {
      message.error('最小质押金额为 10,000 TF');
      return;
    }
    
    if (amount > userStats.balance) {
      message.error('余额不足');
      return;
    }
    
    message.success(`成功质押 ${amount} TF，您已成为超级节点！`);
    setShowStakeModal(false);
    setStakeAmount('');
  };

  const toggleNode = () => {
    if (!isNodeRunning) {
      if (userStats.staked < 10000) {
        message.error('需要质押至少 10,000 TF 才能运行超级节点');
        return;
      }
      message.success('超级节点已启动');
    } else {
      message.info('超级节点已停止');
    }
    setIsNodeRunning(!isNodeRunning);
  };

  return (
    <div>
      <Title level={2}>超级节点面板</Title>
      
      {/* 节点状态概览 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="质押金额"
              value={userStats.staked}
              suffix="TF"
              valueStyle={{ 
                color: userStats.staked >= 10000 ? '#52c41a' : '#ff4d4f',
                fontSize: '24px'
              }}
              prefix={<NodeIndexOutlined />}
            />
            <Text type="secondary">
              {userStats.staked >= 10000 ? '已达到最小质押要求' : '需要质押 10,000 TF'}
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="节点收益"
              value={nodeStats.earnings}
              suffix="TF"
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
              prefix={<DollarOutlined />}
            />
            <Text type="secondary">累计运营收益</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线时长"
              value={nodeStats.hoursOnline}
              suffix="小时"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
            <Text type="secondary">本月运行时间</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据服务"
              value={nodeStats.dataServed}
              suffix="GB"
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
            />
            <Text type="secondary">已提供数据量</Text>
          </Card>
        </Col>
      </Row>

      {/* 节点控制面板 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Space>
              <Text strong>节点状态:</Text>
              <Switch
                checked={isNodeRunning}
                onChange={toggleNode}
                checkedChildren="运行中"
                unCheckedChildren="已停止"
                disabled={userStats.staked < 10000}
              />
              {isNodeRunning ? (
                <PlayCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
              ) : (
                <PauseOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
              )}
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Button 
                type="primary" 
                icon={<ThunderboltOutlined />}
                disabled={userStats.staked >= 10000}
                onClick={() => setShowStakeModal(true)}
              >
                {userStats.staked >= 10000 ? '已质押' : '成为超级节点'}
              </Button>
              <Button icon={<SettingOutlined />}>
                节点设置
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            <Text>
              节点ID: {isNodeRunning ? 'TF-NODE-7B3F9A21' : '未启动'}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* 节点性能指标 */}
      {userStats.staked >= 10000 && (
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card title="性能监控">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>在线率: {nodeStats.uptime}%</Text>
                  <Progress 
                    percent={nodeStats.uptime} 
                    strokeColor={nodeStats.uptime >= 95 ? '#52c41a' : '#fa8c16'}
                  />
                </div>
                <div>
                  <Text>带宽利用率: 75%</Text>
                  <Progress percent={75} strokeColor="#1890ff" />
                </div>
                <div>
                  <Text>连接质量: 优秀</Text>
                  <Progress percent={92} strokeColor="#722ed1" />
                </div>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="收益统计">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text>每小时收益:</Text>
                  <Text strong style={{ color: '#52c41a' }}>5 TF</Text>
                </Row>
                <Row justify="space-between">
                  <Text>日均收益:</Text>
                  <Text strong style={{ color: '#52c41a' }}>120 TF</Text>
                </Row>
                <Row justify="space-between">
                  <Text>月收益预估:</Text>
                  <Text strong style={{ color: '#52c41a' }}>3,600 TF</Text>
                </Row>
                <Row justify="space-between">
                  <Text>年化收益率:</Text>
                  <Text strong style={{ color: '#722ed1' }}>43.2%</Text>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* 质押要求说明 */}
      {userStats.staked < 10000 && (
        <Alert
          message="成为超级节点"
          description={
            <Space direction="vertical">
              <Text>• 最小质押要求: 10,000 TF</Text>
              <Text>• 带宽要求: 100 Mbps 以上</Text>
              <Text>• 预期月收益: 3,600 TF (43.2% 年化)</Text>
              <Text>• 在线率要求: 95% 以上</Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* 网络贡献排行 */}
      <Card title="超级节点排行榜">
        <div style={{ marginBottom: '16px' }}>
          <Row>
            <Col span={8}><Text strong>节点ID</Text></Col>
            <Col span={4}><Text strong>在线率</Text></Col>
            <Col span={4}><Text strong>服务量</Text></Col>
            <Col span={4}><Text strong>月收益</Text></Col>
            <Col span={4}><Text strong>排名</Text></Col>
          </Row>
        </div>
        {[
          { id: 'TF-A1B2C3', uptime: 99.8, served: '2.5TB', earnings: '4200 TF', rank: 1 },
          { id: 'TF-D4E5F6', uptime: 99.2, served: '2.1TB', earnings: '3900 TF', rank: 2 },
          { id: 'TF-G7H8I9', uptime: 98.9, served: '1.9TB', earnings: '3700 TF', rank: 3 },
          { id: 'TF-J0K1L2', uptime: 98.5, served: '1.8TB', earnings: '3600 TF', rank: 4 },
          { id: 'YOUR-NODE', uptime: nodeStats.uptime, served: `${nodeStats.dataServed}GB`, earnings: `${nodeStats.earnings} TF`, rank: 15 },
        ].map((node, index) => (
          <Row 
            key={node.id} 
            style={{ 
              padding: '8px 0', 
              background: node.id === 'YOUR-NODE' ? '#f0f9ff' : 'transparent',
              borderRadius: '4px'
            }}
          >
            <Col span={8}>
              <Text style={{ fontWeight: node.id === 'YOUR-NODE' ? 'bold' : 'normal' }}>
                {node.id}
              </Text>
            </Col>
            <Col span={4}><Text>{node.uptime}%</Text></Col>
            <Col span={4}><Text>{node.served}</Text></Col>
            <Col span={4}><Text style={{ color: '#52c41a' }}>{node.earnings}</Text></Col>
            <Col span={4}>
              <Text style={{ fontWeight: 'bold', color: '#722ed1' }}>
                #{node.rank}
              </Text>
            </Col>
          </Row>
        ))}
      </Card>

      {/* 质押模态框 */}
      <Modal
        title="质押 TF 成为超级节点"
        open={showStakeModal}
        onOk={handleStake}
        onCancel={() => setShowStakeModal(false)}
        okText="确认质押"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="超级节点质押说明"
            description="质押的 TF 将用于网络担保，您可以随时解除质押，但需要7天解锁期。"
            type="warning"
            style={{ marginBottom: '16px' }}
          />
          <div>
            <Text>质押金额</Text>
            <Input
              placeholder="最小质押金额 10,000 TF"
              suffix="TF"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
          </div>
          <Text type="secondary">
            可用余额: {userStats.balance.toFixed(1)} TF
          </Text>
          <Text type="secondary">
            预期月收益: {stakeAmount ? (parseFloat(stakeAmount || '0') * 0.036).toFixed(0) : '0'} TF
          </Text>
        </Space>
      </Modal>
    </div>
  );
};

export default SuperNodePanel;
