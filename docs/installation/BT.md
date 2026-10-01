# 宝塔面板部署往昔开放平台

本文只介绍使用宝塔 Docker 管理器部署**本仓库源码**。不要使用应用商店里的其他项目镜像。

## 前置要求

- 宝塔面板和 Docker 管理器
- Git、Docker Compose v2.24+
- 建议服务器至少 2 核 4 GB 内存

## 从自己的仓库构建

在宝塔终端执行：

```bash
mkdir -p /www/wwwroot/wangxi-open-platform
cd /www/wwwroot/wangxi-open-platform
git clone https://github.com/HeartEase1/wangxi-open-platform.git .
cp .env.example .env
```

私有仓库需要先配置服务器的 GitHub SSH 密钥或 Git Credential Manager。不要把访问令牌写入 Compose 文件。

首次启动前编辑 `.env`，至少生成一个随机的 `SESSION_SECRET`。本地 SQLite 模式可以不设置 `SQL_DSN` 和 `REDIS_CONN_STRING`：

```bash
openssl rand -hex 32
```

启动往昔自己的源码镜像：

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 platform
```

默认端口是 `127.0.0.1:3000`。在宝塔网站中配置反向代理到 `http://127.0.0.1:3000`，然后为自己的域名申请 HTTPS。公网部署时按 [部署与维护](../deployment.md) 配置 `SESSION_COOKIE_SECURE`、`SESSION_COOKIE_TRUSTED_URL` 和 `TRUSTED_PROXIES`。

## 更新

```bash
cd /www/wwwroot/wangxi-open-platform
git pull --ff-only
docker compose up -d --build
docker compose logs --tail=100 platform
```

更新前备份 `.env`、`data/` 和 `logs/`。不要执行 `docker compose down -v`，否则可能删除本地数据卷。已有 PostgreSQL/MySQL 部署必须保留原数据库连接配置，不能直接切换到默认 SQLite。

## 数据目录

- `data/`：SQLite 数据和持久化文件
- `logs/`：运行日志
- `.env`：本机配置，不提交 Git

部署失败时，先查看 `docker compose logs platform`，再检查端口、目录权限和 `.env` 配置。
