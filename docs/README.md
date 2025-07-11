# ThunderFuel Network - Architecture

## Project Architecture

```
thunderfuel/
├── README.md                # 项目说明
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
│   └── p2p-core/            # P2P核心
├── backend/                 # 后端服务
│   ├── api-server/          # API服务器
│   ├── indexer/             # 区块链索引
│   └── analytics/           # 数据分析
└── tools/                   # 开发工具
    ├── testing/             # 测试工具
    ├── monitoring/          # 监控工具
    └── deployment/          # 部署工具
```

## Core Stacks

- **Block Chain**: Solana (Rust)
- **Client**: React + TypeScript + WebAssembly
- **Node**: Rust + libp2p + QUIC
- **Smart Contract**: Anchor Framework (Solana)
- **Database**: PostgreSQL + Redis
- **Dashboard**: Prometheus + Grafana
- **Deployment**: Docker + Kubernetes

## Dev Environment

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.16+
- Docker 20+
- Git

## Quick Start

1. Clone the Repo.
2. npm install dependencies.
3. npm start
4. test

Please referto the README files.
