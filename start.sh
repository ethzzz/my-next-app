#! /bin/bash

# 检查包管理器
if command -v yarn &> /dev/null; then
    PKG_MGR="yarn"
elif command -v pnpm &> /dev/null; then
    PKG_MGR="pnpm"
elif command -v npm &> /dev/null; then
    PKG_MGR="npm"
else
    echo "Error: No package manager found. Please install pnpm, yarn, or npm."
    exit 1
fi

echo "使用包管理器: $PKG_MGR"

# 安装根目录依赖
echo "安装 Next.js 依赖..."
$PKG_MGR install

# 安装 server 依赖
echo "安装 server 依赖..."
cd server
$PKG_MGR install
cd ..

# 启动 Next.js 和 server
echo "启动 Next.js 和 server..."

# 后台启动 server
cd server
$PKG_MGR dev &
cd ..

# 启动 Next.js（前台）
$PKG_MGR next:dev