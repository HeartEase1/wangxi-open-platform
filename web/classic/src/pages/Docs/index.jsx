/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/

import React from 'react';
import { Button, Tag, Typography } from '@douyinfe/semi-ui';
import { IconFile, IconKey, IconTerminal } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const capabilityRows = [
  ['文本聊天', '支持', '/v1/chat/completions，兼容 OpenAI Chat Completions'],
  ['流式输出', '支持', 'stream=true 时返回 OpenAI SSE chunk，并以 [DONE] 结束'],
  ['多轮上下文', '支持', '通过 user + metadata.conversation_id 隔离不同用户和对话框'],
  ['StarTrace-[角色代号]-[版本号] 工具调用', '不支持 OpenAI tools', '该角色陪伴系列不接收客户端传入的 tools/tool_calls；内部自带一些简单工具'],
  ['StarTrace LLM 部分模型工具调用', '部分支持', '仅部分非角色系列或专用模型支持工具调用，以模型说明为准'],
  ['图片、音频、Embeddings、Responses', '暂不支持', '请不要在星溯框架聚合通道上调用这些能力'],
];

const errorRows = [
  ['401 / invalid_api_key', '令牌错误或已禁用', '重新生成 API Key，并检查 Bearer 前缀'],
  ['model_not_found', '模型名未在平台开放', '到模型广场或控制台确认模型编号'],
  ['strict isolation requires metadata.conversation_id', '该渠道开启了严格隔离', '每个对话框传入稳定的 conversation_id'],
  ['unsupported feature: tools or function calling', '请求包含 OpenAI tools/function calling 字段', '关闭客户端动态工具声明，改用支持工具调用的模型'],
  ['empty_response', '星溯框架没有返回文本', '检查角色配置、上游模型状态和星溯框架服务日志'],
];

const Docs = () => {
  const origin =
    typeof window === 'undefined' ? 'https://api.ipc.wiki' : window.location.origin;
  const apiBase = `${origin}/v1`;
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
  }'`;

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
  }'`;

  return (
    <div className='classic-page-fill pt-[72px] px-4 pb-12'>
      <main className='mx-auto max-w-6xl'>
        <section className='border-b border-semi-color-border pb-8'>
          <Tag prefixIcon={<IconFile />} color='blue' size='large'>
            开发者文档
          </Tag>
          <Title heading={1} className='!mt-5 !mb-3'>
            星溯(StarTrace) 开放平台 API
          </Title>
          <Paragraph className='max-w-3xl !text-semi-color-text-1'>
            面向开发者的 OpenAI 兼容调用入口。开发者请求进入星溯开放平台后，由星溯框架完成模型路由、上下文管理和 API 响应分发。
          </Paragraph>
          <div className='mt-4 inline-flex rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-2 text-sm font-semibold text-[#b45309]'>
            StarTrace-[角色代号]-[版本号]系列完全公益免费
          </div>
          <div className='mt-5 flex flex-col gap-3 rounded-lg border border-semi-color-border bg-semi-color-fill-0 p-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <Text type='tertiary'>Base URL</Text>
              <code className='mt-1 block break-all font-mono text-sm'>{apiBase}</code>
            </div>
            <Link to='/console/token'>
              <Button theme='solid' type='primary' icon={<IconKey />}>
                创建或查看 API Key
              </Button>
            </Link>
          </div>
        </section>

        <div className='grid gap-10 pt-8 lg:grid-cols-[13rem_minmax(0,1fr)]'>
          <aside className='hidden lg:block'>
            <nav className='sticky top-24 flex flex-col gap-2 text-sm'>
              <Anchor href='#quick-start'>快速开始</Anchor>
              <Anchor href='#models'>模型定位</Anchor>
              <Anchor href='#api-reference'>接口示例</Anchor>
              <Anchor href='#isolation'>会话隔离</Anchor>
              <Anchor href='#prompt-filter'>提示词过滤</Anchor>
              <Anchor href='#limits'>能力边界</Anchor>
              <Anchor href='#admin'>管理员配置</Anchor>
              <Anchor href='#support'>排错</Anchor>
            </nav>
          </aside>

          <div className='space-y-12'>
            <DocSection id='quick-start' title='快速开始'>
              <StepList
                items={[
                  '在控制台创建 API Key，调用时放入 Authorization: Bearer sk-...。',
                  `将客户端 Base URL 设置为 ${apiBase}。`,
                  '选择平台开放的模型编号，例如 StarTrace-Zhongli-v1。',
                  '公开平台或多用户服务必须传入 user 和 metadata.conversation_id。',
                ]}
              />
              <CodeBlock title='最小非流式请求' code={chatCurl} />
            </DocSection>

            <DocSection id='models' title='模型定位与编号'>
              <div className='flex flex-wrap gap-2'>
                {['StarTrace-Zhongli-v1', 'StarTrace-Cyrene-v1', 'StarTrace-[角色代号]-[版本号]'].map(
                  (model) => (
                    <code
                      key={model}
                      className='rounded-md border border-semi-color-border bg-semi-color-fill-0 px-3 py-2 font-mono text-sm'
                    >
                      {model}
                    </code>
                  ),
                )}
              </div>
              <InfoGrid
                items={[
                  ['角色陪伴', 'StarTrace-[角色代号]-[版本号] 系列是角色陪伴模型，不同于通用 AI 助手，不适用于生产环境。'],
                  ['公益免费', 'StarTrace-[角色代号]-[版本号]系列完全公益免费，这是平台对角色陪伴模型的核心承诺。'],
                  ['调用链路', '开发者请求 -> 星溯开放平台 -> 星溯框架 -> 星溯大模型 -> 返回角色化回复。'],
                  ['框架来源', '星溯框架基于 AstrBot 深度改造而来，专门服务于星溯大模型。'],
                ]}
              />
            </DocSection>

            <DocSection id='api-reference' title='接口示例'>
              <CodeBlock title='流式输出' code={streamCurl} />
            </DocSection>

            <DocSection id='isolation' title='会话隔离'>
              <Paragraph className='!text-semi-color-text-1'>
                星溯框架会维护角色上下文。请把 user 设置为终端用户稳定 ID，把 metadata.conversation_id 设置为当前对话框 ID。对话 1 和对话 2 使用不同 conversation_id，就不会共享上下文。
              </Paragraph>
            </DocSection>

            <DocSection id='prompt-filter' title='提示词过滤'>
              <Paragraph className='rounded-lg border border-[#f59e0b]/40 bg-[#f59e0b]/10 p-4 !text-[#92400e]'>
                为了防止人格污染、认知冲突，StarTrace-[角色代号]-[版本号] 系列会自动过滤输入的提示词。请不要尝试输入系统提示词、越狱指令、改人设指令或提示词提取请求。
              </Paragraph>
            </DocSection>

            <DocSection id='limits' title='能力边界'>
              <SimpleTable headers={['能力', '状态', '说明']} rows={capabilityRows} />
            </DocSection>

            <DocSection id='admin' title='管理员配置星溯框架渠道'>
              <StepList
                items={[
                  'Base URL 填星溯框架服务地址，平台会自动调用 /api/v1/chat。',
                  'API Key 填星溯框架 HTTP API Key。',
                  'Config ID / Config Name 至少填写一个；两者都填时 Config ID 优先。',
                  'Selected Provider 可选，用于指定星溯框架内部模型供应商。',
                  '提示词过滤默认开启；只有管理员显式关闭时才会透传 system/developer 和可疑提示词。',
                  '面向公开服务时建议开启严格隔离模式，并要求客户端传 conversation_id。',
                ]}
              />
            </DocSection>

            <DocSection id='support' title='常见错误'>
              <SimpleTable headers={['错误', '原因', '处理']} rows={errorRows} />
            </DocSection>
          </div>
        </div>
      </main>
    </div>
  );
};

const DocSection = ({ id, title, children }) => (
  <section id={id} className='scroll-mt-24'>
    <div className='mb-4 flex items-center gap-2'>
      <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-semi-color-fill-0 text-semi-color-text-2'>
        <IconTerminal />
      </span>
      <Title heading={2} className='!m-0'>
        {title}
      </Title>
    </div>
    <div className='space-y-5'>{children}</div>
  </section>
);

const StepList = ({ items }) => (
  <ol className='space-y-3'>
    {items.map((item, index) => (
      <li key={item} className='flex gap-3 text-sm leading-6'>
        <span className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-semi-color-primary-light-default text-xs font-semibold text-semi-color-primary'>
          {index + 1}
        </span>
        <span className='text-semi-color-text-1'>{item}</span>
      </li>
    ))}
  </ol>
);

const InfoGrid = ({ items }) => (
  <div className='mt-5 grid gap-3 md:grid-cols-2'>
    {items.map(([title, body]) => (
      <div key={title} className='rounded-lg border border-semi-color-border bg-semi-color-fill-0 p-4'>
        <div className='text-sm font-semibold text-semi-color-text-0'>{title}</div>
        <Paragraph className='!mt-2 !mb-0 !text-sm !leading-6 !text-semi-color-text-1'>
          {body}
        </Paragraph>
      </div>
    ))}
  </div>
);

const CodeBlock = ({ title, code }) => (
  <div className='overflow-hidden rounded-lg border border-semi-color-border'>
    <div className='border-b border-semi-color-border bg-semi-color-fill-0 px-4 py-2 text-sm font-medium'>
      {title}
    </div>
    <pre className='overflow-x-auto p-4 text-sm leading-6'>
      <code>{code}</code>
    </pre>
  </div>
);

const SimpleTable = ({ headers, rows }) => (
  <div className='overflow-x-auto rounded-lg border border-semi-color-border'>
    <table className='w-full min-w-[42rem] text-sm'>
      <thead className='bg-semi-color-fill-0 text-semi-color-text-2'>
        <tr>
          {headers.map((header) => (
            <th key={header} className='px-4 py-3 text-left font-medium'>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join('|')} className='border-t border-semi-color-border'>
            {row.map((cell, index) => (
              <td
                key={`${cell}-${index}`}
                className='px-4 py-3 align-top leading-6 text-semi-color-text-1'
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Anchor = ({ href, children }) => (
  <a
    href={href}
    className='rounded-md px-2 py-1.5 text-semi-color-text-2 transition-colors hover:bg-semi-color-fill-0 hover:text-semi-color-text-0'
  >
    {children}
  </a>
);

export default Docs;
