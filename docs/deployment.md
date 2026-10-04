# 往昔开放平台部署与维护

本地开发环境安装和前端预览请先阅读[本地开发与预览](local-development.md)。

## 从 GitHub 构建镜像并部署

仓库：https://github.com/HeartEase1/wangxi-open-platform 。私有仓库需要先配置 GitHub SSH 密钥或 Git Credential Manager 等读取凭据，不要把访问令牌写进命令、镜像或配置文件。

需要 Docker Engine 和 Docker Compose v2.24+。服务器第一次部署时获取本仓库的 Compose 文件，后续更新只拉取镜像，不需要在服务器安装 Go、Bun 或重新构建源码：

```sh
git clone https://github.com/HeartEase1/wangxi-open-platform.git
cd wangxi-open-platform
cp .env.example .env
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
docker compose logs -f platform
```

默认镜像为 `ghcr.io/heartease1/wangxi-open-platform:latest`。`.github/workflows/docker-build.yml` 会在 `main` 分支推送和版本标签时由 GitHub Actions 构建并发布镜像。仓库公开不等于 GHCR 容器包公开；如果拉取时返回 `401`，请使用带 `read:packages` 权限的 GitHub PAT 登录：

```sh
read -r -s GHCR_TOKEN
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io --username HeartEase1 --password-stdin
unset GHCR_TOKEN
```

也可以在 [容器包设置](https://github.com/users/HeartEase1/packages/container/wangxi-open-platform/settings) 中将包设为公开，公开包可以匿名拉取。`compose.wangxi.yml` 是默认 Compose 的兼容入口。

浏览器打开 `http://localhost:3000` 并完成初始化。SQLite 数据位于 `data/one-api.db`（保留兼容文件名），日志位于 `logs/`。不要删除这些目录。`.env` 是可选运行配置，默认 SQLite 不需要外部数据库和 Redis。

## 域名和 HTTPS

默认只监听宿主机 `127.0.0.1:3000`。在宿主机 Nginx/Caddy 配置 HTTPS 反向代理到该地址。容器内代理不能用自己的 localhost 访问本服务，应加入共同网络并访问 `platform:3000`。

在 `.env` 中配置自己的站点（替换示例域名并生成持久随机密钥）：

```dotenv
SESSION_SECRET=replace_with_a_long_random_secret
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_TRUSTED_URL=https://api.example.com
```

`SESSION_COOKIE_TRUSTED_URL` 必须是实际浏览器访问的精确 HTTPS Origin，多个 Origin 用逗号分隔。仅本机 HTTP 调试时保持 `.env.example` 中的默认配置。`TRUSTED_PROXIES` 按实际反向代理地址配置，不要填写客户端地址。反向代理需要转发 Host、X-Forwarded-Proto、X-Forwarded-For，启用 WebSocket 支持并关闭流式响应缓冲。

## 使用已有数据库

已有部署必须沿用原来的数据库连接与数据卷，不能直接把 PostgreSQL/MySQL 部署切换到默认 SQLite。在 `.env` 设置 `SQL_DSN`，需要 Redis 时设置 `REDIS_CONN_STRING`；容器内 `localhost` 指向容器自身。连接独立数据库应使用可达的主机名/地址。

保留原 Compose 管理的数据库服务和数据卷，单独升级应用服务的镜像配置。不要运行 `docker compose down -v`。修改 Compose 项目名会改变默认命名卷归属，迁移时必须显式连接原数据卷并核对数据。

## 更新与回退

1. 保存当前提交号 `git rev-parse HEAD`，备份 `.env`、数据库和持久目录。SQLite 应先停止应用再完整备份 `data/`；外部数据库使用相应数据库备份工具。
2. 在测试环境验证新版本及数据库迁移。
3. `docker compose pull`，然后 `docker compose up -d --remove-orphans`。
4. 检查 `docker compose ps`、`docker compose logs --tail=100 platform` 与 `/api/status`。

回退时在 `.env` 设置 `WANGXI_IMAGE_TAG=sha-<旧提交号>`，再执行 `docker compose pull && docker compose up -d --remove-orphans`，并恢复与旧版本配套的数据库备份。仅回退镜像无法撤销数据库迁移。

浏览器更新检查链接指向本仓库。私有仓库不支持匿名读取 GitHub Releases，检查失败时由维护者通过已登录的 GitHub 或 `git fetch origin` 查看版本；无需向浏览器提供 GitHub 令牌。

## 二进制部署

```sh
cd web
bun install --frozen-lockfile
bun run build
cd ..
go build -ldflags "-X github.com/QuantumNous/new-api/common.Version=$(cat VERSION)" -o bin/wangxi-api .
mkdir -p data logs
cd data
../bin/wangxi-api --port 3000 --log-dir ../logs
```

Go 模块路径保留上游标识以兼容代码导入；生成的程序为本项目的 `wangxi-api`。Windows 将输出文件名改为 `bin/wangxi-api.exe`，并在 PowerShell 中使用 `(Get-Content VERSION)` 获取版本。

Linux systemd 配置见根目录 `wangxi-platform.service`。先创建服务用户、准备目录、复制可执行文件并配置权限，再安装该文件并执行 `systemctl daemon-reload` 和 `systemctl enable --now wangxi-platform`。二进制模式请通过防火墙限制 3000 端口，仅由反向代理访问。

## 自有发布工作流

`Build Wangxi container` 会在 `main` 推送、`v*` 标签或手动触发时运行，使用仓库 `GITHUB_TOKEN` 将镜像发布到 `ghcr.io/heartease1/wangxi-open-platform`。主分支发布 `latest` 和 `sha-<提交号>`，版本标签还会发布同名标签。服务器通过 `docker compose pull` 获取新镜像；本地源码构建仅用于开发，可使用 `docker-compose.local.yml` 覆盖层。
