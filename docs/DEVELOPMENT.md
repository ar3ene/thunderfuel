# ThunderFuel Network 开发指南

## 快速开始

### 1. 环境要求
- Node.js 18+
- Rust 1.70+
- PostgreSQL 13+ (可选，用于生产环境)
- Git

### 2. 一键启动
```bash
./start.sh
```

这将启动：
- Web 客户端 (http://localhost:3000)
- 超级节点 (http://localhost:8001)
- API 服务和监控

### 3. 手动启动

#### 启动 Web 客户端
```bash
cd client/web
npm install
npm start
```

#### 启动超级节点
```bash
cd node/super-node
cargo run -- --verbose
```

## 项目结构

```
thunderfuel/
├── 📄 whitepaper.md          # 项目白皮书
├── 🚀 start.sh              # 一键启动脚本
├── 📚 docs/                 # 文档目录
├── 🔗 contracts/            # Solana 智能合约
│   ├── src/lib.rs           # 奖励分发合约
│   └── Cargo.toml           # Rust 依赖配置
├── 🖥️ client/               # 客户端应用
│   └── web/                 # React Web 应用
│       ├── src/
│       │   ├── App.tsx      # 主应用组件
│       │   ├── components/  # UI 组件
│       │   └── index.tsx    # 应用入口
│       └── package.json     # 前端依赖
└── 🌐 node/                # 节点软件
    └── super-node/          # 超级节点实现
        ├── src/main.rs      # 节点主程序
        ├── src/config.rs    # 配置管理
        └── Cargo.toml       # 节点依赖
```

## 核心功能

### 1. 三层网络架构
- **基础层**: 标准 P2P 网络，兼容 BitTorrent 协议
- **加速层**: 超级节点 + 边缘 CDN，提供高速传输
- **激励层**: Solana 区块链，TF 代币奖励机制

### 2. 代币经济模型
- **上传奖励**: 2 TF/GB + 稀缺系数加成
- **做种奖励**: 0.1 TF/小时 + 热度加权
- **节点奖励**: 5 TF/小时 + 在线率加权
- **加速消费**: 10 TF = 300% 速度提升

### 3. 用户界面特性
- 🎯 类 uTorrent 界面设计
- ⚡ 实时速度监控
- 💰 TF 钱包集成
- 🔧 超级节点管理面板

## 开发工作流

### 1. 前端开发
```bash
cd client/web
npm run start     # 开发服务器
npm run build     # 生产构建
npm run test      # 运行测试
```

### 2. 智能合约开发
```bash
cd contracts
anchor build      # 编译合约
anchor test       # 运行测试
anchor deploy     # 部署到链上
```

### 3. 节点开发
```bash
cd node/super-node
cargo build       # 编译
cargo test         # 运行测试
cargo run          # 启动节点
```

## API 接口

### 节点状态 API
```
GET /api/v1/status
GET /api/v1/metrics
GET /api/v1/peers
```

### 用户数据 API
```
GET /api/v1/user/{pubkey}/balance
GET /api/v1/user/{pubkey}/rewards
POST /api/v1/upload/report
```

### 网络统计 API
```
GET /api/v1/network/stats
GET /api/v1/network/nodes
GET /api/v1/torrents/popular
```

## 配置说明

### 节点配置 (config.toml)
```toml
[node]
bandwidth_mbps = 100      # 节点带宽 (Mbps)
max_connections = 1000    # 最大连接数
storage_limit_gb = 100    # 存储限制 (GB)
stake_amount = 10000      # 质押金额 (TF)

[network]
tcp_port = 7001          # TCP 端口
quic_port = 7001         # QUIC 端口
mdns_enabled = true      # 局域网发现

[api]
host = "0.0.0.0"        # API 监听地址
port = 8001             # API 端口
```

## 性能优化

### 1. QUIC 协议优化
- 0-RTT 连接建立
- 多路径传输
- 前向纠错 (20% 冗余)

### 2. 动态分片调度
- 基于延迟的源选择
- TF 余额优先级分配
- 智能缓存管理

### 3. 硬件加速
- WebAssembly SIMD 优化
- WebGPU 视频解码
- 多线程并发下载

## 监控和调试

### 1. 日志级别
```bash
RUST_LOG=debug cargo run    # 详细日志
RUST_LOG=info cargo run     # 普通日志
```

### 2. 性能指标
- Prometheus 指标: http://localhost:8001/metrics
- 实时监控面板
- 网络健康度检查

### 3. 调试工具
```bash
# 网络连接测试
curl http://localhost:8001/api/v1/status

# 查看活跃连接
curl http://localhost:8001/api/v1/peers

# 检查用户余额
curl http://localhost:8001/api/v1/user/{pubkey}/balance
```

## 部署指南

### 1. 开发环境
使用 `./start.sh` 一键启动完整开发环境

### 2. 生产环境
```bash
# 1. 构建所有组件
npm run build --prefix client/web
cargo build --release --manifest-path node/super-node/Cargo.toml

# 2. 配置数据库
createdb thunderfuel
psql thunderfuel < schema.sql

# 3. 启动服务
./node/super-node/target/release/thunderfuel-super-node --config prod.toml
```

### 3. Docker 部署
```bash
# 构建镜像
docker build -t thunderfuel/super-node .

# 运行容器
docker run -d -p 8001:8001 -p 7001:7001 thunderfuel/super-node
```

## 贡献指南

### 1. 代码规范
- Rust: 使用 `cargo fmt` 和 `cargo clippy`
- TypeScript: 使用 ESLint + Prettier
- 提交信息: 遵循 Conventional Commits

### 2. 测试要求
- 单元测试覆盖率 > 80%
- 集成测试必须通过
- 性能基准测试

### 3. 提交流程
1. Fork 项目
2. 创建功能分支
3. 编写测试
4. 提交 PR
5. 代码审查

## 常见问题

### Q: 如何成为超级节点？
A: 质押至少 10,000 TF 代币，确保带宽 ≥100 Mbps，在线率 ≥95%

### Q: TF 代币如何获得？
A: 通过上传文件、长期做种、运营超级节点、邀请新用户等方式获得

### Q: 下载速度如何优化？
A: 增加 TF 代币余额、连接更多超级节点、选择热门资源

### Q: 如何兑换现金？
A: 通过交易所、官方礼品卡商城或 OTC 通道兑换

## 技术支持

- 🐛 Bug 报告: [GitHub Issues](https://github.com/thunderfuel/network/issues)
- 💬 社区讨论: [Discord](https://discord.gg/thunderfuel)
- 📖 技术文档: [GitBook](https://docs.thunderfuel.io)
- 🏃 开发进度: [Roadmap](https://roadmap.thunderfuel.io)

---

**免责声明**: 本项目为技术演示，代币功能仅用于激励机制展示，不构成投资建议。
