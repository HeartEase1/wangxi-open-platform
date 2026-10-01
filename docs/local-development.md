# 往昔开放平台本地开发与预览

本文以 Windows PowerShell 为例。Linux/macOS 只需把安装命令替换为对应系统的包管理器命令。

## 1. 安装开发环境

在 PowerShell 中执行：

```powershell
winget install --id Git.Git -e
winget install --id GoLang.Go -e
winget install --id Oven-sh.Bun -e
```

关闭并重新打开 PowerShell，确认版本：

```powershell
git --version
go version       # 需要 Go 1.25.1 或更高版本
bun --version
```

如果电脑没有 `winget`，从官方安装包安装 [Git](https://git-scm.com/download/win)、[Go](https://go.dev/dl/) 和 [Bun](https://bun.sh/docs/installation)。本地开发不要求 Docker、MySQL 或 Redis；默认使用 SQLite。

## 2. 获取代码并安装依赖

```powershell
git clone https://github.com/HeartEase1/wangxi-open-platform.git
Set-Location wangxi-open-platform
go mod download
Set-Location web
bun install --frozen-lockfile
Set-Location ..
```

后端会自动读取项目根目录的 `.env`。首次开发可以不创建它，程序会使用 SQLite 和默认的本地 HTTP 配置。需要保存个人配置时再执行：

```powershell
Copy-Item .env.example .env
```

不要把真实密钥提交到 Git；`.env` 已被忽略。需要指定数据库文件时，可在 `.env` 中加入 `SQLITE_PATH=wangxi-dev.db` 和 `PORT=3000`。

## 3. 启动后端

打开第一个 PowerShell，进入仓库根目录：

```powershell
go run .
```

首次启动会初始化 SQLite 数据库，默认监听 `http://localhost:3000`。后端会嵌入 `web/dist`；如果目录不存在或需要更新嵌入页面，先执行 `Set-Location web; bun run build; Set-Location ..`，再运行 `go run .`。

看到服务启动后，用浏览器访问 `http://localhost:3000` 完成管理员初始化。接口健康检查地址为 `http://localhost:3000/api/status`。

## 4. 启动前端开发预览

保持后端运行，打开第二个 PowerShell：

```powershell
Set-Location wangxi-open-platform\web
bun run dev
```

打开终端显示的地址，通常是 `http://localhost:5173`。Rsbuild 会把 `/api`、`/v1`、`/mj` 和 `/pg` 请求代理到 `http://localhost:3000`，所以登录和接口调试都通过本地后端完成。修改 `web/src` 后页面会热更新。

如果后端不在 3000 端口，在 `web` 目录创建 `.env.development.local`：

```dotenv
VITE_REACT_APP_SERVER_URL=http://localhost:你的端口
```

该文件只供本机使用，不要提交到仓库。

## 5. 预览生产构建

`bun run dev` 适合开发，`bun run preview` 只预览已经生成的生产包：

```powershell
Set-Location web
bun run build
bun run preview
```

预览服务通常在 `http://localhost:4173`。它只提供前端静态文件；要使用登录、模型和渠道接口，仍需让后端运行在 `http://localhost:3000`，或通过 `VITE_REACT_APP_SERVER_URL` 指向可用后端。

## 6. 使用 Docker 开发环境（可选）

如果需要模拟 PostgreSQL + Redis，安装 Docker Desktop 后在仓库根目录执行：

```powershell
docker compose -f docker-compose.dev.yml up -d --build
```

然后仍可在第二个终端运行 `Set-Location web; bun run dev`。停止服务：

```powershell
docker compose -f docker-compose.dev.yml down
```

不要使用 `down -v`，除非确认要删除本地开发数据库卷。

## 常见问题

- `go` 或 `bun` 找不到：安装后重启终端，确认 Go 和 Bun 已加入 PATH。
- 页面打开但接口失败：确认后端仍在运行，并检查 `http://localhost:3000/api/status`。
- 页面显示旧内容：停止后端，重新运行 `Set-Location web; bun run build`，再从仓库根目录 `go run .`。
