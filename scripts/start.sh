#!/bin/bash

# ThunderFuel Network 一键启动脚本

set -e

echo "🚀 启动 ThunderFuel Network 开发环境..."

# 检查依赖
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安装，请先安装 $1"
        exit 1
    fi
}

echo "📋 检查依赖..."
check_dependency "node"
check_dependency "cargo"
check_dependency "git"

# 检查 Node.js 版本
NODE_VERSION=$(node --version | cut -d'v' -f2)
if [ $(echo "$NODE_VERSION 18.0" | awk '{print ($1 < $2)}') -eq 1 ]; then
    echo "❌ Node.js 版本需要 >= 18.0，当前版本: $NODE_VERSION"
    exit 1
fi

echo "✅ 依赖检查通过"

# 安装 Web 客户端依赖
echo "📦 安装 Web 客户端依赖..."
cd client/web
if [ ! -d "node_modules" ]; then
    npm install
fi

# 启动 Web 客户端
echo "🌐 启动 Web 客户端..."
npm start &
WEB_PID=$!

# 返回根目录
cd ../..

# 编译超级节点
echo "🔧 编译超级节点..."
cd node/super-node
cargo build --release
cd ../..

# 启动超级节点 (开发模式)
echo "🖥️  启动超级节点..."
cd node/super-node
cargo run -- --verbose &
NODE_PID=$!

cd ../..

echo "✅ ThunderFuel Network 启动完成!"
echo ""
echo "🌐 Web 界面: http://localhost:3000"
echo "🔗 API 服务: http://localhost:8001"
echo "📊 指标监控: http://localhost:8001/metrics"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待中断信号
trap "echo '🛑 停止服务...'; kill $WEB_PID $NODE_PID 2>/dev/null; exit 0" INT

wait
