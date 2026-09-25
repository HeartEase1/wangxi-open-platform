# 往昔开放平台升级说明

## 版本和代码历史

- 上游仓库：https://github.com/QuantumNous/new-api
- 最新发布版查询日期：2026-09-25。
- 本次合并：`v1.0.0-rc.40`，提交 `0aec08fee811ec6136828fda790551b49e410301`。
- 该版本仍是上游发布候选版（RC），此次没有额外合入发布后 main 分支的未发布提交。
- 原始目录与上游 `52858ad1e617069b708d820e1ea8a312b8077c85` 最接近；2082 个文件内容一致、83 个有差异。原有定制作为独立提交保存。
- 升级前快照标签：`wangxi-pre-upgrade-20260925`。回滚线上服务时，必须配套恢复升级前数据库备份；仅回退代码不足以撤销上游数据库迁移。
- Git 远程 `origin` 为往昔仓库，`upstream` 为官方 New API。后续使用 `git fetch upstream --tags`，审查新版后合并指定发布标签。

## 兼容迁移

- 上游已移除 classic 双前端布局，前端源码统一为 `web/src`，构建产物为 `web/dist`。原定制文档页、首页、统计展示和 AstrBot 配置迁入新布局。
- 协议与渠道设置类型已迁移至独立的 `relaykit` Go 模块，AstrBot 和提示词过滤代码已同步调整。
- 旧定制版 AstrBot 使用渠道编号 `59`，新版上游将此编号分配给 Sub2API。本项目 AstrBot 改为 `1001`。启动时只迁移旧编号中含非空 `astrbot_config_id` 或 `astrbot_config_name` 的记录；不修改上游 Sub2API 渠道。迁移可重复执行，不改密钥、模型映射或会话设置。
- 无法解析的旧编号渠道设置会阻止启动并报告渠道 ID，避免把配置损坏的 AstrBot 渠道静默识别成 Sub2API。部署前应修复该记录；不要直接把所有 `59` 批量改为 `1001`。
- 星溯供应商图标和模型标识继续保留；新建星溯供应商未指定图标时使用 `/startrace.png`。新版供应商展示遵循上游只读价格查询，不在读取价格时重新创建已删除的供应商记录。
- 保留原项目强制记录请求 IP 的策略。
- 平台默认名称改为「往昔开放平台」，模型/框架名称 StarTrace 保持原含义。历史数据库中的系统名称、Logo、首页 HTML 等后台自定义设置需要运营方在后台调整。

## 构建和启动

```powershell
cd web
bun install --frozen-lockfile
bun run typecheck
bun run build
cd ..
go build -ldflags "-X github.com/QuantumNous/new-api/common.Version=v1.0.0-rc.40-wangxi.1" -o bin/wangxi-api.exe .
```

Linux 可把输出文件改为 `bin/wangxi-api`。使用 Go 1.25.1 以上版本，独立校验 relaykit 时运行 `cd relaykit && GOWORK=off go build ./...`。

Docker 本地启动：

```sh
docker compose -f compose.wangxi.yml up -d --build
```

该入口从本项目源码构建并使用 SQLite，端口仅绑定本机。`data/`、`logs/`、密钥文件和环境配置不提交到仓库。上游 `docker-compose.yml` 保留作为官方参考，其默认镜像不包含往昔定制。

已有部署应先备份数据库和配置，在独立环境完成启动与升级验证后再切换流量。此次任务只更新代码和仓库，没有连接生产数据库或更改线上部署。

## 验证记录

验证环境：Windows、Go 1.26.5、Bun 1.3.14，Go SQLite 驱动报告 SQLite 3.50.4。

- `bun install --frozen-lockfile`、`bun run typecheck`、`bun run build`：通过。
- `bun run test --maxWorkers=8`：166 个测试文件、2094 项测试全部通过。
- 本次修改的 40 个前端文件：oxlint 无 error；保留一个自定义页脚 HTML 的既有 warning。按上游保护版权头的方式检查格式，通过。
- `go test ./relay/channel/astrbot ./relay ./model`：通过，包括会话隔离、流式响应、提示词过滤和新增渠道迁移测试。
- `go test ./controller -run '^(TestChannel|TestFetchUpstream|TestGetChannel|TestValidateChannel|TestDashboardListModels)' -count=1`：通过。
- `cd relaykit; GOWORK=off go build ./...`：独立构建通过；根模块完整可执行文件构建通过。
- 隔离 SQLite 数据库启动两次：`/api/status` 正确返回平台名称及版本，`/docs` 返回 200。两次启动之间插入旧 AstrBot 与 Sub2API 渠道，重启后分别为 `1001` 和 `59`，未连接生产数据。

完整 `go test ./controller` 未通过；观察到多个上游数据库矩阵/审计测试在 Windows 清理临时 `audit.db` 时因文件占用失败。全项目 `bun run lint` 也有上游未修改文件中的既有错误，不能声称全库 lint 已通过。当前机器没有 Docker、MySQL 和 PostgreSQL 测试服务，三数据库完整升级矩阵及 Docker 镜像构建未验证，不能据此宣称生产数据库升级已经验证。

新仓库的 GitHub Actions 暂停，避免导入时触发上游的镜像发布与机器人工作流；需要配置本项目的 CI 和发布目标后再启用。
