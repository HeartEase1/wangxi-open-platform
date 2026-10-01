/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import {
  BrainCircuit,
  Fingerprint,
  Layers3,
  Route,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

interface ArchitectureItem {
  key: string
  icon: LucideIcon
  titleZh: string
  titleEn: string
  valueZh: string
  valueEn: string
}
const ARCHITECTURE_ITEMS: ArchitectureItem[] = [
  {
    key: 'gateway',
    icon: BrainCircuit,
    titleZh: '统一接入',
    titleEn: 'Unified access',
    valueZh: '通过 OpenAI 兼容接口接入多种模型和上游服务。',
    valueEn:
      'Connect to models and upstream services through an OpenAI-compatible API.',
  },
  {
    key: 'routing',
    icon: Route,
    titleZh: '智能路由',
    titleEn: 'Smart routing',
    valueZh: '按渠道、模型、权重和健康状态选择可用的请求路径。',
    valueEn:
      'Select request paths by channel, model, weight, and health status.',
  },
  {
    key: 'management',
    icon: Layers3,
    titleZh: '集中管理',
    titleEn: 'Centralized management',
    valueZh: '统一管理账号、API Key、渠道、模型、额度和用量记录。',
    valueEn:
      'Manage accounts, API keys, channels, models, quotas, and usage records in one place.',
  },
  {
    key: 'security',
    icon: ShieldCheck,
    titleZh: '安全审计',
    titleEn: 'Security and audit',
    valueZh: '提供权限控制、会话隔离、请求日志和错误追踪。',
    valueEn:
      'Apply access control, session isolation, request logs, and error tracing.',
  },
  {
    key: 'model-id',
    icon: Fingerprint,
    titleZh: '模型标识',
    titleEn: 'Model identifiers',
    valueZh: '使用控制台中公开的模型 ID，应用无需感知底层渠道差异。',
    valueEn:
      'Use public model IDs from the console without coupling apps to provider details.',
  },
]
const CALL_CHAIN = [
  { zh: '开发者请求', en: 'Developer request' },
  { zh: '往昔开放平台', en: 'Wangxi platform' },
  { zh: '渠道路由', en: 'Channel routing' },
  { zh: '模型服务', en: 'Model service' },
  { zh: '返回响应', en: 'API response' },
]

export function HowItWorks() {
  const { t, i18n } = useTranslation()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)
  return (
    <section className='border-border/40 relative z-10 border-t px-6 py-20 md:py-28'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='grid gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-end'>
          <div>
            <p className='text-muted-foreground mb-3 text-xs font-medium tracking-widest uppercase'>
              {text('平台架构', 'Architecture')}
            </p>
            <h2 className='text-2xl leading-tight font-semibold md:text-4xl'>
              {text(
                '统一的 AI 接入与管理链路',
                'A unified AI access and management path'
              )}
            </h2>
          </div>
          <p className='text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base'>
            {text(
              '从 API 请求到渠道路由、模型服务和响应返回，平台提供清晰可控的管理链路。',
              'Keep the path from API request to routing, model service, and response clear and manageable.'
            )}
          </p>
        </AnimateInView>
        <AnimateInView
          delay={120}
          className='border-border/50 bg-muted/20 mt-12 rounded-xl border p-4 md:p-5'
        >
          <div className='mb-4 flex items-center gap-2 text-sm font-medium'>
            <Route
              className='text-muted-foreground size-4'
              aria-hidden='true'
            />
            <span>{text('调用链路', 'Request path')}</span>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            {CALL_CHAIN.map((step, index) => (
              <div key={step.en} className='flex items-center gap-2'>
                <span className='border-border/70 bg-background rounded-lg border px-3 py-2 text-sm'>
                  {text(step.zh, step.en)}
                </span>
                {index < CALL_CHAIN.length - 1 ? (
                  <span className='text-muted-foreground/45 font-mono text-xs'>
                    {'->'}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </AnimateInView>
        <div className='mt-6 grid gap-4 md:grid-cols-2'>
          {ARCHITECTURE_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <AnimateInView
                key={item.key}
                delay={180 + index * 80}
                animation='fade-up'
              >
                <article className='border-border/60 bg-card/75 h-full rounded-xl border p-5 shadow-xs'>
                  <div className='flex items-start gap-4'>
                    <span className='bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg'>
                      <Icon className='size-5' strokeWidth={1.6} />
                    </span>
                    <div className='min-w-0'>
                      <h3 className='text-base font-semibold'>
                        {text(item.titleZh, item.titleEn)}
                      </h3>
                      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                        {text(item.valueZh, item.valueEn)}
                      </p>
                    </div>
                  </div>
                </article>
              </AnimateInView>
            )
          })}
        </div>
      </div>
    </section>
  )
}
