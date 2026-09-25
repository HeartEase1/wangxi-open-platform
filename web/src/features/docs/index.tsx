/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code2,
  KeyRound,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { PublicLayout } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const modelExamples = [
  'StarTrace-Zhongli-v1',
  'StarTrace-Cyrene-v1',
  'StarTrace-[角色代号]-[版本号]',
]

const capabilityRows = [
  ['文本聊天', '支持', '/v1/chat/completions，兼容 OpenAI Chat Completions'],
  ['流式输出', '支持', 'stream=true 时返回 OpenAI SSE chunk，并以 [DONE] 结束'],
  [
    '多轮上下文',
    '支持',
    '请在 messages 中携带当前对话历史，并为多用户服务传入 user 与 conversation_id',
  ],
  [
    'StarTrace-[角色代号]-[版本号] 工具调用',
    '不支持 OpenAI tools',
    '该角色陪伴系列不接收客户端传入的 tools/tool_calls；内部自带一些简单工具',
  ],
  [
    'StarTrace LLM 部分模型工具调用',
    '部分支持',
    '仅部分非角色系列或专用模型支持工具调用，以模型说明为准',
  ],
  [
    '图片、音频、Embeddings、Responses',
    '暂不支持',
    '请不要在 StarTrace 角色系列上调用这些能力',
  ],
]

const errorRows = [
  [
    '401 / invalid_api_key',
    '令牌错误或已禁用',
    '重新生成 API Key，并检查 Bearer 前缀',
  ],
  ['model_not_found', '模型名未在平台开放', '到模型广场或控制台确认模型编号'],
  [
    'strict isolation requires a conversation id',
    '当前模型要求稳定的会话 ID',
    '为每个对话框传入 metadata.conversation_id，或使用等价的 session_id/chat_id/thread_id',
  ],
  [
    'unsupported feature: tools or function calling',
    '请求包含 OpenAI tools/function calling 字段',
    '关闭客户端动态工具声明，改用支持工具调用的模型',
  ],
  [
    'empty_response',
    '模型服务没有返回可用文本',
    '稍后重试；若持续出现，请联系平台支持并附上 Request ID',
  ],
]

export function Docs() {
  const origin =
    typeof window === 'undefined'
      ? 'https://api.ipc.wiki'
      : window.location.origin
  const apiBase = `${origin}/v1`
  const chatCurl = `curl ${apiBase}/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "StarTrace-Zhongli-v1",
    "user": "user-42",
    "metadata": {
      "conversation_id": "chat-window-001"
    },
    "messages": [
      { "role": "user", "content": "你好，请用角色语气做个自我介绍。" }
    ]
  }'`

  const streamCurl = `curl -N ${apiBase}/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "StarTrace-Zhongli-v1",
    "stream": true,
    "user": "user-42",
    "metadata": {
      "conversation_id": "chat-window-001"
    },
    "messages": [
      { "role": "user", "content": "继续刚才的话题。" }
    ]
  }'`

  const sdkExample = `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.STARTRACE_API_KEY,
  baseURL: '${apiBase}',
})

const completion = await client.chat.completions.create({
  model: 'StarTrace-Zhongli-v1',
  user: 'user-42',
  metadata: {
    conversation_id: 'chat-window-001',
  },
  messages: [
    { role: 'user', content: '用角色语气回复我。' },
  ],
})

console.log(completion.choices[0]?.message?.content)`

  return (
    <PublicLayout>
      <div className='mx-auto max-w-6xl px-4 py-10 md:py-14'>
        <header className='border-border/60 border-b pb-8'>
          <Badge variant='outline' className='mb-4 gap-1.5'>
            <BookOpen className='size-3.5' />
            开发者文档
          </Badge>
          <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end'>
            <div>
              <h1 className='text-3xl font-semibold tracking-normal md:text-5xl'>
                往昔开放平台 API
              </h1>
              <p className='text-muted-foreground mt-5 max-w-3xl text-base leading-7 md:text-lg'>
                面向开发者的 OpenAI 兼容调用入口。你可以使用 OpenAI SDK
                或兼容客户端接入 StarTrace 模型，按现有 Chat Completions
                方式发送消息并接收文本或流式回复。
              </p>
              <div className='mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-100'>
                <Sparkles className='size-4' />
                StarTrace-[角色代号]-[版本号]系列完全公益免费
              </div>
            </div>
            <div className='bg-muted/25 border-border/60 rounded-lg border p-4'>
              <div className='text-muted-foreground text-xs font-medium'>
                Base URL
              </div>
              <code className='mt-2 block font-mono text-sm break-all'>
                {apiBase}
              </code>
              <Button className='mt-4 w-full' render={<Link to='/keys' />}>
                <KeyRound className='size-4' />
                创建或查看 API Key
              </Button>
            </div>
          </div>
        </header>

        <div className='grid gap-10 pt-8 lg:grid-cols-[13rem_minmax(0,1fr)]'>
          <aside className='hidden lg:block'>
            <nav className='sticky top-24 space-y-1 text-sm'>
              <SideLink href='#quick-start'>快速开始</SideLink>
              <SideLink href='#models'>模型定位</SideLink>
              <SideLink href='#architecture'>技术架构</SideLink>
              <SideLink href='#api-reference'>接口示例</SideLink>
              <SideLink href='#isolation'>会话隔离</SideLink>
              <SideLink href='#security'>调用规范</SideLink>
              <SideLink href='#limits'>能力边界</SideLink>
              <SideLink href='#support'>排错</SideLink>
            </nav>
          </aside>

          <main className='space-y-12'>
            <DocSection
              id='quick-start'
              icon={<Terminal />}
              title='快速开始'
              description='终端用户继续使用 OpenAI 兼容协议，不需要知道后端渠道细节。'
            >
              <StepList
                items={[
                  '在控制台创建 API Key，调用时放入 Authorization: Bearer sk-...。',
                  `将客户端 Base URL 设置为 ${apiBase}。`,
                  '选择平台开放的模型编号，例如 StarTrace-Zhongli-v1。',
                  '在 messages 中携带当前对话历史，平台会按 OpenAI Chat Completions 兼容格式处理。',
                  '公开多用户服务必须传入稳定的 user；多对话框应用建议同时传入 metadata.conversation_id。',
                ]}
              />
              <CodeBlock title='最小非流式请求' code={chatCurl} />
            </DocSection>

            <DocSection
              id='models'
              icon={<MessageSquareText />}
              title='模型定位与编号'
              description='StarTrace-[角色代号]-[版本号] 系列是角色陪伴模型，而不是通用 AI 助手。'
            >
              <div className='grid gap-3 md:grid-cols-3'>
                {modelExamples.map((model) => (
                  <code
                    key={model}
                    className='bg-muted/35 border-border/60 rounded-lg border px-3 py-2 font-mono text-sm'
                  >
                    {model}
                  </code>
                ))}
              </div>
              <InfoGrid
                items={[
                  ['基座模型', 'Qwen3.6-27B'],
                  [
                    '微调方案',
                    '基于 LoRA（低秩适配）技术，对每个角色独立训练轻量级适配器层。',
                  ],
                  [
                    '服务框架',
                    '星溯框架负责模型路由、上下文编排和 API 响应分发。',
                  ],
                  [
                    '角色陪伴',
                    '该系列强调角色人格、语气和长期陪伴体验，不适合作为生产环境里的通用 AI 助手。',
                  ],
                  [
                    '公益免费',
                    'StarTrace-[角色代号]-[版本号]系列完全公益免费，这是平台对角色陪伴模型的核心承诺。',
                  ],
                  [
                    '调用链路',
                    '开发者请求 -> 往昔开放平台 -> 星溯框架 -> 星溯大模型 -> 返回角色化回复。',
                  ],
                ]}
              />
            </DocSection>

            <DocSection
              id='architecture'
              icon={<Sparkles />}
              title='星溯大模型技术架构'
              description='“星溯大模型，让每个角色都有灵魂。”'
            >
              <div className='via-background dark:via-background rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-100/60 to-sky-100/50 p-5 dark:from-amber-500/10 dark:to-sky-500/10'>
                <p className='text-muted-foreground text-sm leading-7'>
                  星际和平公司·往昔项目组，捕捉数字星尘中的人影。星溯大模型（StarTrace
                  LLM）围绕角色陪伴、人格一致性和多轮对话体验构建，由往昔开放平台提供统一的开发者接入入口。
                </p>
              </div>
              <InfoGrid
                items={[
                  [
                    '基座模型',
                    'Qwen3.6-27B，作为 StarTrace LLM 的基础能力底座。',
                  ],
                  [
                    '微调方案',
                    '基于 LoRA（低秩适配）技术，对每个角色独立训练轻量级适配器层，用于强化角色语气、知识边界和人格稳定性。',
                  ],
                  [
                    '星溯框架',
                    '负责模型路由、上下文管理、角色运行环境和 OpenAI 兼容响应分发，对开发者屏蔽底层模型与运行时差异。',
                  ],
                  [
                    '调用链路',
                    '开发者请求 -> 往昔开放平台 -> 星溯框架 -> 星溯大模型 -> 返回角色化回复。',
                  ],
                  [
                    '模型编号',
                    'StarTrace-[角色代号]-[版本号]，例如 StarTrace-Zhongli-v1。',
                  ],
                  [
                    '适用场景',
                    '角色陪伴、剧情互动、人格化聊天、受控客户端中的长期角色体验。',
                  ],
                ]}
              />
            </DocSection>

            <DocSection
              id='api-reference'
              icon={<Code2 />}
              title='接口示例'
              description='目前开放文本聊天和流式输出，返回结构保持 OpenAI Chat Completions 兼容。'
            >
              <CodeBlock title='Node.js OpenAI SDK' code={sdkExample} />
              <CodeBlock title='流式输出' code={streamCurl} />
            </DocSection>

            <DocSection
              id='isolation'
              icon={<ShieldCheck />}
              title='上下文与会话隔离'
              description='平台兼容主流 OpenAI 客户端和 Agent 框架。为了避免多用户或多对话框串上下文，请按下面方式传参。'
            >
              <InfoGrid
                items={[
                  [
                    'messages',
                    '每次请求都应携带当前对话窗口需要模型看到的历史消息。只传最后一句时，模型通常无法理解之前的上下文。',
                  ],
                  [
                    'user',
                    '传终端用户的稳定 ID。公开平台服务多个用户时，不要把所有请求都写成同一个 user。',
                  ],
                  [
                    'metadata.conversation_id',
                    '多对话框应用建议为每个对话框传入稳定且唯一的 conversation_id，用于隔离不同聊天窗口。',
                  ],
                  [
                    '公开平台转接',
                    '如果你的服务再对外服务其他用户，请把真实终端用户映射成不同的 user，并为每个聊天窗口生成不同的 conversation_id。',
                  ],
                ]}
              />
              <p className='text-muted-foreground mt-4 text-sm leading-6'>
                平台推荐使用
                <code className='bg-muted mx-1 rounded px-1 py-0.5'>
                  metadata
                </code>
                中的
                <code className='bg-muted mx-1 rounded px-1 py-0.5'>
                  conversation_id
                </code>
                字段。部分兼容客户端也可以使用 session_id、chat_id、thread_id
                等等价字段。只要
                <code className='bg-muted mx-1 rounded px-1 py-0.5'>user</code>
                和会话 ID
                能区分真实用户与真实对话框，就能最大程度避免上下文混淆。
              </p>
            </DocSection>

            <DocSection
              id='security'
              icon={<AlertTriangle />}
              title='调用规范'
              description='StarTrace 角色系列面向角色陪伴场景。请按正常对话方式调用，不要把它当作通用系统提示词执行器。'
            >
              <div className='space-y-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm leading-6 text-amber-900 dark:text-amber-50'>
                <p>
                  对于 StarTrace-[角色代号]-[版本号]
                  系列，请避免发送系统提示词提取、越狱、改人设、绕过安全边界等请求。此类输入可能被拒绝、过滤或返回安全提示。
                </p>
                <p>
                  推荐把角色扮演内容写成普通 user 对话，而不是依赖
                  system/developer
                  提示词覆盖角色设定。平台可能会对不适合角色陪伴场景的提示词进行保护性处理。
                </p>
                <p>
                  如果你在 Agent 框架中接入，请关闭该模型不支持的
                  tools、图片、音频、Embeddings 或 Responses
                  调用，避免产生无效请求。
                </p>
              </div>
            </DocSection>

            <DocSection
              id='limits'
              icon={<CheckCircle2 />}
              title='能力边界'
              description='星溯模型定位为角色模型，不同于通用 AI 助手，不适用于生产环境。'
            >
              <ResponsiveTable
                headers={['能力', '状态', '说明']}
                rows={capabilityRows}
              />
            </DocSection>

            <DocSection
              id='support'
              icon={<AlertTriangle />}
              title='常见错误'
              description='平台会明确拒绝未支持能力，不做静默降级。'
            >
              <ResponsiveTable
                headers={['错误', '原因', '处理']}
                rows={errorRows}
              />
            </DocSection>
          </main>
        </div>
      </div>
    </PublicLayout>
  )
}

function DocSection(props: {
  id: string
  icon: ReactNode
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={props.id} className='scroll-mt-24'>
      <div className='mb-4 flex items-start gap-3'>
        <div className='bg-muted/60 text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg'>
          {props.icon}
        </div>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>
            {props.title}
          </h2>
          {props.description ? (
            <p className='text-muted-foreground mt-1 text-sm leading-6'>
              {props.description}
            </p>
          ) : null}
        </div>
      </div>
      <div className='space-y-5'>{props.children}</div>
    </section>
  )
}

function SideLink(props: { href: string; children: ReactNode }) {
  return (
    <a
      href={props.href}
      className='text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-2 py-1.5 transition-colors'
    >
      {props.children}
    </a>
  )
}

function StepList(props: { items: string[] }) {
  return (
    <ol className='space-y-3'>
      {props.items.map((item, index) => (
        <li key={item} className='flex gap-3 text-sm leading-6'>
          <span className='bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
            {index + 1}
          </span>
          <span className='text-muted-foreground'>{item}</span>
        </li>
      ))}
    </ol>
  )
}

function InfoGrid(props: { items: Array<[string, string]> }) {
  return (
    <div className='mt-5 grid gap-3 md:grid-cols-2'>
      {props.items.map(([title, body]) => (
        <div key={title} className='bg-card rounded-xl border p-4'>
          <div className='text-sm font-semibold'>{title}</div>
          <p className='text-muted-foreground mt-2 text-sm leading-6'>{body}</p>
        </div>
      ))}
    </div>
  )
}

function CodeBlock(props: { title: string; code: string }) {
  return (
    <div className='overflow-hidden rounded-lg border'>
      <div className='bg-muted/40 border-b px-4 py-2 text-sm font-medium'>
        {props.title}
      </div>
      <pre className='overflow-x-auto p-4 text-sm leading-6'>
        <code>{props.code}</code>
      </pre>
    </div>
  )
}

function ResponsiveTable(props: { headers: string[]; rows: string[][] }) {
  return (
    <div className='overflow-x-auto rounded-lg border'>
      <table className='w-full min-w-[42rem] text-sm'>
        <thead className='bg-muted/40 text-muted-foreground'>
          <tr>
            {props.headers.map((header) => (
              <th key={header} className='px-4 py-3 text-left font-medium'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr key={row.join('|')} className='border-t'>
              {row.map((cell, index) => (
                <td key={props.headers[index]} className='px-4 py-3 align-top'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
