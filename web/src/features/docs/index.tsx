/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code2,
  KeyRound,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { PublicLayout } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const capabilityRows = [
  [
    '文本聊天',
    '支持',
    '通过 /v1/chat/completions 兼容 OpenAI Chat Completions。',
  ],
  ['流式输出', '支持', 'stream=true 时返回 OpenAI SSE 数据流。'],
  [
    '多轮上下文',
    '支持',
    '在 messages 中携带当前对话历史，并为不同用户传入稳定的 user。',
  ],
  [
    '工具调用',
    '按模型配置',
    '是否支持 tools/function calling 以控制台中的模型说明为准。',
  ],
  [
    '图片、音频、Embeddings、Responses',
    '按模型配置',
    '请在调用前查看模型与渠道的能力说明。',
  ],
]

const errorRows = [
  [
    '401 / invalid_api_key',
    '令牌错误或已禁用',
    '重新生成 API Key，并检查 Bearer 前缀。',
  ],
  ['model_not_found', '模型未开放', '到模型管理或控制台确认模型编号。'],
  [
    'unsupported feature',
    '请求包含模型不支持的字段',
    '关闭对应能力，或更换支持该能力的模型。',
  ],
  [
    'empty_response',
    '模型服务没有返回可用文本',
    '稍后重试；若持续出现，请联系平台维护者并附上 Request ID。',
  ],
]

export function Docs() {
  const origin =
    typeof window === 'undefined'
      ? 'http://localhost:3000'
      : window.location.origin
  const apiBase = `${origin}/v1`
  const chatCurl = `curl ${apiBase}/chat/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model",
    "user": "user-42",
    "messages": [
      { "role": "user", "content": "你好，请介绍一下往昔开放平台。" }
    ]
  }'`
  const sdkExample = `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.WANGXI_API_KEY,
  baseURL: '${apiBase}',
})

const completion = await client.chat.completions.create({
  model: 'your-model',
  user: 'user-42',
  messages: [{ role: 'user', content: '你好！' }],
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
                统一的 AI 模型接入和管理平台，提供 OpenAI
                兼容接口、渠道管理、API Key、用量统计与安全控制。
              </p>
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
              <SideLink href='#models'>模型与渠道</SideLink>
              <SideLink href='#api-reference'>接口示例</SideLink>
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
              description='使用 OpenAI SDK 或兼容客户端接入平台。'
            >
              <StepList
                items={[
                  '在控制台创建 API Key，调用时放入 Authorization: Bearer sk-...。',
                  `将客户端 Base URL 设置为 ${apiBase}。`,
                  '从模型管理中选择可用的模型编号。',
                  '在 messages 中携带当前对话历史，并为多用户服务传入稳定的 user。',
                ]}
              />
              <CodeBlock title='最小请求' code={chatCurl} />
            </DocSection>
            <DocSection
              id='models'
              icon={<CheckCircle2 />}
              title='模型与渠道'
              description='模型由渠道配置和平台策略共同决定，实际能力以控制台显示为准。'
            >
              <InfoGrid
                items={[
                  [
                    '模型编号',
                    '使用控制台显示的公开模型 ID，不要猜测或复用已下线的名称。',
                  ],
                  [
                    '渠道管理',
                    '管理员可以配置上游地址、鉴权方式、模型映射、权重和健康状态。',
                  ],
                  [
                    'API Key',
                    '为不同应用或用户创建独立密钥，便于权限控制和用量审计。',
                  ],
                  [
                    '用量统计',
                    '在控制台查看请求、错误、模型使用量和额度变化。',
                  ],
                ]}
              />
            </DocSection>
            <DocSection
              id='api-reference'
              icon={<Code2 />}
              title='接口示例'
              description='返回结构保持 OpenAI Chat Completions 兼容。'
            >
              <CodeBlock title='Node.js OpenAI SDK' code={sdkExample} />
            </DocSection>
            <DocSection
              id='security'
              icon={<ShieldCheck />}
              title='调用规范'
              description='请保护密钥并为不同用户和会话传入可区分的标识。'
            >
              <InfoGrid
                items={[
                  ['messages', '每次请求携带当前对话需要的历史消息。'],
                  [
                    'user',
                    '公开服务中为每个终端用户使用稳定且不同的 user 值。',
                  ],
                  [
                    'conversation_id',
                    '多对话框应用可通过 metadata.conversation_id 区分聊天窗口。',
                  ],
                  ['密钥安全', '不要把 API Key 写入前端代码、公开仓库或日志。'],
                ]}
              />
            </DocSection>
            <DocSection
              id='limits'
              icon={<CheckCircle2 />}
              title='能力边界'
              description='不同模型和渠道的能力可能不同，请以控制台配置为准。'
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
              description='平台会明确返回错误，不做静默降级。'
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
