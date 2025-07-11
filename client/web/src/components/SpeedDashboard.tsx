import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface Props {
  currentSpeed: number;
  networkStats: {
    totalUsers: number;
    totalNodes: number;
    totalData: number;
    avgSpeed: number;
  };
}

const SpeedDashboard: React.FC<Props> = ({ currentSpeed, networkStats }) => {
  return (
    <div>
      <Title level={2}>速度仪表盘</Title>
      
      {/* 实时速度显示 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="当前下载速度"
              value={currentSpeed.toFixed(1)}
              suffix="MB/s"
              valueStyle={{ color: '#1890ff', fontSize: '32px' }}
            />
            <Progress 
              percent={Math.min((currentSpeed / 100) * 100, 100)} 
              strokeColor="#1890ff"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="当前上传速度"
              value={(currentSpeed * 0.3).toFixed(1)}
              suffix="MB/s"
              valueStyle={{ color: '#52c41a', fontSize: '32px' }}
            />
            <Progress 
              percent={Math.min(((currentSpeed * 0.3) / 30) * 100, 100)}
              strokeColor="#52c41a"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="网络平均速度"
              value={networkStats.avgSpeed}
              suffix="MB/s"
              valueStyle={{ color: '#722ed1', fontSize: '32px' }}
            />
            <Text type="secondary">
              {currentSpeed > networkStats.avgSpeed ? '高于' : '低于'}网络平均水平
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 速度趋势 - 简化版本 */}
      <Card title="速度趋势" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '20px 0' }}>
          {[
            { time: '30分钟前', speed: 25 },
            { time: '25分钟前', speed: 30 },
            { time: '20分钟前', speed: 28 },
            { time: '15分钟前', speed: 45 },
            { time: '10分钟前', speed: 52 },
            { time: '5分钟前', speed: 48 },
            { time: '现在', speed: currentSpeed },
          ].map((item, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Row justify="space-between" align="middle">
                <Text>{item.time}</Text>
                <div style={{ flex: 1, margin: '0 20px' }}>
                  <Progress 
                    percent={(item.speed / 80) * 100} 
                    showInfo={false}
                    strokeColor={index === 6 ? "#722ed1" : "#1890ff"}
                  />
                </div>
                <Text strong style={{ color: index === 6 ? "#722ed1" : "#1890ff" }}>
                  {item.speed.toFixed(1)} MB/s
                </Text>
              </Row>
            </div>
          ))}
        </div>
      </Card>

      {/* 网络状态 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="网络健康度">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>节点连通性</Text>
                <Progress percent={96} strokeColor="#52c41a" />
              </div>
              <div>
                <Text>数据完整性</Text>
                <Progress percent={99} strokeColor="#1890ff" />
              </div>
              <div>
                <Text>网络稳定性</Text>
                <Progress percent={94} strokeColor="#722ed1" />
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="优化建议">
            <Space direction="vertical">
              <Text>• 当前网络状况良好，速度表现优异</Text>
              <Text>• 建议增加上传分享以获得更多TF奖励</Text>
              <Text>• 可考虑成为超级节点获得稳定收益</Text>
              <Text>• 热门资源下载速度可达峰值</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SpeedDashboard;
