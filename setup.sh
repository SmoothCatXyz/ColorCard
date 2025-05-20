#!/bin/bash

# 安装依赖
echo "正在安装依赖..."
npm install

# 创建.env.local文件（如果不存在）
if [ ! -f .env.local ]; then
  echo "创建环境变量文件..."
  echo "NEXT_PUBLIC_DEFAULT_LOCALE=zh" > .env.local
fi

# 启动开发服务器
echo "启动开发服务器..."
npm run dev 