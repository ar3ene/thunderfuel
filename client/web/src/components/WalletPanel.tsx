import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  Typography, 
  Table, 
  Tag,
  Modal,
  Input,
  message
} from 'antd';
import { 
  WalletOutlined, 
  SendOutlined, 
  SwapOutlined,
  GiftOutlined,
  DollarOutlined
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
  tokenPrice: number;
}

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer';
  amount: number;
  description: string;
  time: string;
  status: 'completed' | 'pending';
}

const WalletPanel: React.FC<Props> = ({ userStats, tokenPrice }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [exchangeAmount, setExchangeAmount] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earn',
      amount: 16.4,
      description: '上传文件奖励',
      time: '10分钟前',
      status: 'completed'
    },
    {
      id: '2',
      type: 'earn',
      amount: 2.5,
      description: '做种奖励',
      time: '1小时前',
      status: 'completed'
    },
    {
      id: '3',
      type: 'spend',
      amount: -10,
      description: '下载加速消费',
      time: '2小时前',
      status: 'completed'
    },
    {
      id: '4',
      type: 'earn',
      amount: 50,
      description: '邀请新用户奖励',
      time: '昨天',
      status: 'completed'
    }
  ];

  const handleTransfer = () => {
    if (!transferAmount || !transferAddress) {
      message.error('请填写完整的转账信息');
      return;
    }
    
    const amount = parseFloat(transferAmount);
    if (amount > userStats.balance) {
      message.error('余额不足');
      return;
    }
    
    message.success(`成功转账 ${amount} TF`);
    setShowTransferModal(false);
    setTransferAmount('');
    setTransferAddress('');
  };

  const handleExchange = () => {
    if (!exchangeAmount) {
      message.error('请输入兑换金额');
      return;
    }
    
    const amount = parseFloat(exchangeAmount);
    if (amount > userStats.balance) {
      message.error('TF余额不足');
      return;
    }
    
    if (amount < 100) {
      message.error('最小兑换金额为100 TF');
      return;
    }
    
    const usdValue = amount * tokenPrice;
    message.success(`成功申请兑换 ${amount} TF ≈ $${usdValue.toFixed(2)}`);
    setShowExchangeModal(false);
    setExchangeAmount('');
  };

  const transactionColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config = {
          earn: { color: 'green', text: '收入' },
          spend: { color: 'red', text: '支出' },
          transfer: { color: 'blue', text: '转账' }
        };
        return <Tag color={config[type as keyof typeof config].color}>
          {config[type as keyof typeof config].text}
        </Tag>;
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text style={{ 
          color: amount > 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {amount > 0 ? '+' : ''}{amount} TF
        </Text>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? '已完成' : '处理中'}
        </Tag>
      )
    }
  ];

  return (
    <div>
      <Title level={2}>TF 钱包</Title>
      
      {/* 钱包概览 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="可用余额"
              value={userStats.balance}
              suffix="TF"
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              prefix={<WalletOutlined />}
            />
            <Text type="secondary">
              ≈ ${(userStats.balance * tokenPrice).toFixed(2)} USD
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="质押中"
              value={userStats.staked}
              suffix="TF"
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
            />
            <Text type="secondary">超级节点质押</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日收益"
              value={userStats.earnings}
              prefix="$"
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
            <Text type="secondary">
              +{(userStats.earnings / tokenPrice).toFixed(1)} TF
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>快速操作</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              block
              onClick={() => setShowTransferModal(true)}
            >
              转账 TF
            </Button>
          </Col>
          <Col span={6}>
            <Button 
              icon={<DollarOutlined />} 
              block
              onClick={() => setShowExchangeModal(true)}
            >
              兑换现金
            </Button>
          </Col>
          <Col span={6}>
            <Button 
              icon={<GiftOutlined />} 
              block
            >
              兑换礼品卡
            </Button>
          </Col>
          <Col span={6}>
            <Button 
              icon={<SwapOutlined />} 
              block
            >
              接收 TF
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 兑换汇率 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="当前汇率">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Text>1 TF = ${tokenPrice} USD</Text>
                <Tag color="green">+2.3%</Tag>
              </Space>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Text>礼品卡兑换</Text>
                <Text>1 TF = $0.01</Text>
              </Space>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Text>OTC 通道</Text>
                <Text>1 TF = $0.009</Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="兑换说明">
            <Space direction="vertical">
              <Text>• 最小兑换金额：100 TF</Text>
              <Text>• 礼品卡兑换：免手续费，5分钟到账</Text>
              <Text>• 法币兑换：1%手续费，24小时到账</Text>
              <Text>• 交易所：市价兑换，即时到账</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 交易记录 */}
      <Card title="最近交易">
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* 转账模态框 */}
      <Modal
        title="转账 TF"
        open={showTransferModal}
        onOk={handleTransfer}
        onCancel={() => setShowTransferModal(false)}
        okText="确认转账"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>接收地址</Text>
            <Input
              placeholder="输入接收方钱包地址"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
            />
          </div>
          <div>
            <Text>转账金额</Text>
            <Input
              placeholder="输入转账金额"
              suffix="TF"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </div>
          <Text type="secondary">
            可用余额: {userStats.balance.toFixed(1)} TF
          </Text>
        </Space>
      </Modal>

      {/* 兑换模态框 */}
      <Modal
        title="兑换现金"
        open={showExchangeModal}
        onOk={handleExchange}
        onCancel={() => setShowExchangeModal(false)}
        okText="确认兑换"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>兑换金额</Text>
            <Input
              placeholder="输入兑换的TF数量"
              suffix="TF"
              value={exchangeAmount}
              onChange={(e) => setExchangeAmount(e.target.value)}
            />
          </div>
          {exchangeAmount && (
            <Text>
              预计收到: ${(parseFloat(exchangeAmount || '0') * tokenPrice).toFixed(2)} USD
            </Text>
          )}
          <Text type="secondary">
            最小兑换金额: 100 TF
          </Text>
          <Text type="secondary">
            可用余额: {userStats.balance.toFixed(1)} TF
          </Text>
        </Space>
      </Modal>
    </div>
  );
};

export default WalletPanel;
