# ThunderFuel Network - 技术架构设计

## 项目结构

```
thunderfuel/
├── README.md                 # 项目说明
├── whitepaper.md            # 白皮书
├── docs/                    # 文档目录
│   ├── api/                 # API文档
│   ├── protocol/            # 协议规范
│   └── guides/              # 开发指南
├── contracts/               # 智能合约
│   ├── src/                 # Solana程序源码
│   ├── tests/               # 合约测试
│   └── scripts/             # 部署脚本
├── client/                  # 客户端应用
│   ├── web/                 # Web客户端
│   ├── desktop/             # 桌面客户端
│   └── mobile/              # 移动端
├── node/                    # 节点软件
│   ├── super-node/          # 超级节点
│   ├── edge-cdn/            # 边缘CDN
│   └── gateway/             # 区块链网关
├── protocol/                # 网络协议
│   ├── quic-transport/      # QUIC传输层
│   ├── incentive-layer/     # 激励协议
│   └── p2p-core/           # P2P核心
├── backend/                 # 后端服务
│   ├── api-server/          # API服务器
│   ├── indexer/             # 区块链索引
│   └── analytics/           # 数据分析
└── tools/                   # 开发工具
    ├── testing/             # 测试工具
    ├── monitoring/          # 监控工具
    └── deployment/          # 部署工具
```

## 核心技术栈

- **区块链**: Solana (Rust)
- **客户端**: React + TypeScript + WebAssembly
- **节点**: Rust + libp2p + QUIC
- **智能合约**: Anchor Framework (Solana)
- **数据库**: PostgreSQL + Redis
- **监控**: Prometheus + Grafana
- **部署**: Docker + Kubernetes

## 开发环境要求

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.16+
- Docker 20+
- Git

## 快速开始

1. 克隆仓库
2. 安装依赖
3. 启动开发环境
4. 运行测试

详细步骤见各组件的 README 文件。
