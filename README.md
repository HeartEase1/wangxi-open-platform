# 往昔开放平台

往昔开放平台提供统一的 AI 模型调用入口、渠道管理、账号管理、API 密钥、用量统计与计费管理，并保留 AstrBot 接入能力。

- 项目仓库：[HeartEase1/wangxi-open-platform](https://github.com/HeartEase1/wangxi-open-platform)
- [本地开发与预览](docs/local-development.md) · [部署与维护](docs/deployment.md) · [升级记录](docs/wangxi-upgrade.md) · [任务插件开发](docs/plugin-api/README.md)
- 部署版本以本仓库的 `VERSION` 和发布记录为准。

## 快速部署

安装 Docker Engine 和 Docker Compose v2.24+。服务器只需保存 Compose 文件、`.env`、`data/` 和 `logs/`，应用镜像由 GitHub Actions 构建并发布到 GHCR。

```sh
git clone https://github.com/HeartEase1/wangxi-open-platform.git
cd wangxi-open-platform
cp .env.example .env
docker compose pull
docker compose up -d --remove-orphans
docker compose logs -f platform
```

访问 `http://localhost:3000`，按初始化向导创建管理员。默认使用 SQLite，数据保存在 `data/`，日志保存在 `logs/`，端口只绑定本机。公网访问请按[部署文档](docs/deployment.md)配置域名、HTTPS 和反向代理。

默认镜像为 `ghcr.io/heartease1/wangxi-open-platform:latest`，由本仓库的 GitHub Actions 在 `main` 分支更新后自动构建。更新时无需在服务器编译源码，运行 `docker compose pull && docker compose up -d --remove-orphans` 即可。回滚时在 `.env` 设置 `WANGXI_IMAGE_TAG=sha-<提交号>`。如果 GHCR 包尚未设为公开，先执行 `docker login ghcr.io`。

本地需要从源码构建时，使用 `docker-compose.local.yml` 覆盖层：

```sh
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

## 本地开发

前端使用 Bun，后端使用 Go，默认 SQLite 不需要安装 MySQL 或 Redis。Windows 安装、后端启动、前端热更新和生产包预览请参阅[本地开发与预览](docs/local-development.md)。

## 反馈与贡献

问题和改进建议请提交到[本仓库 Issues](https://github.com/HeartEase1/wangxi-open-platform/issues)。安全问题请参阅 [SECURITY.md](.github/SECURITY.md)。目前未列出往昔开放平台的赞助商或商业合作伙伴。

## 开源来源与许可

本项目基于 [New API](https://github.com/QuantumNous/new-api) 二次开发，继承其 AGPL-3.0 许可及相关第三方许可。上游来源仅用于说明代码沿革，不是本平台的部署入口或运营主体。

请保留并遵守 [LICENSE](LICENSE)、[NOTICE](NOTICE) 与 [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md) 中的版权和许可要求。
