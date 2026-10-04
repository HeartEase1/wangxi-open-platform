# 宝塔面板部署往昔开放平台

本文介绍使用宝塔 Docker 管理器部署 GitHub Actions 构建的**往昔开放平台镜像**。镜像来自本仓库的 GHCR，不使用其他项目镜像。

## 前置要求

- 宝塔面板和 Docker 管理器
- Docker Compose v2.24+
- 建议服务器至少 2 核 4 GB 内存

## 从 GitHub 镜像部署

在宝塔终端执行：

```bash
mkdir -p /www/wwwroot/wangxi-open-platform
cd /www/wwwroot/wangxi-open-platform
git clone https://github.com/HeartEase1/wangxi-open-platform.git .
cp .env.example .env
```

如果仓库或 GHCR 包为私有，需要先配置服务器的 GitHub 凭据。不要把访问令牌写入 Compose 文件。

首次启动前编辑 `.env`，至少生成一个随机的 `SESSION_SECRET`。本地 SQLite 模式可以不设置 `SQL_DSN` 和 `REDIS_CONN_STRING`：

```bash
openssl rand -hex 32
```

启动 GitHub Actions 发布的往昔镜像：

```bash
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
docker compose logs --tail=100 platform
```

默认端口是 `127.0.0.1:3000`。在宝塔网站中配置反向代理到 `http://127.0.0.1:3000`，然后为自己的域名申请 HTTPS。公网部署时按 [部署与维护](../deployment.md) 配置 `SESSION_COOKIE_SECURE`、`SESSION_COOKIE_TRUSTED_URL` 和 `TRUSTED_PROXIES`。

## 更新

```bash
cd /www/wwwroot/wangxi-open-platform
docker compose pull
docker compose up -d --remove-orphans
docker compose logs --tail=100 platform
```

更新不需要 `git pull` 或在服务器重新构建源码。若 GHCR 包为私有，首次拉取前执行 `docker login ghcr.io`；回滚可在 `.env` 设置 `WANGXI_IMAGE_TAG=sha-<提交号>`。

更新前备份 `.env`、`data/` 和 `logs/`。不要执行 `docker compose down -v`，否则可能删除本地数据卷。已有 PostgreSQL/MySQL 部署必须保留原数据库连接配置，不能直接切换到默认 SQLite。

## 数据目录

- `data/`：SQLite 数据和持久化文件
- `logs/`：运行日志
- `.env`：本机配置，不提交 Git

部署失败时，先查看 `docker compose logs platform`，再检查端口、目录权限和 `.env` 配置。
