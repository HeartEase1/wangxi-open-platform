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
  GitBranch,
  Layers3,
  Route,
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
  note?: string
}

const ARCHITECTURE_ITEMS: ArchitectureItem[] = [
  {
    key: 'base-model',
    icon: BrainCircuit,
    titleZh: '\u57fa\u5ea7\u6a21\u578b',
    titleEn: 'Base model',
    valueZh: 'Qwen3.5-27B',
    valueEn: 'Qwen3.5-27B',
  },
  {
    key: 'fine-tuning',
    icon: GitBranch,
    titleZh: '\u5fae\u8c03\u65b9\u6848',
    titleEn: 'Fine-tuning',
    valueZh:
      '\u57fa\u4e8e LoRA\uff08\u4f4e\u79e9\u9002\u914d\uff09\u6280\u672f\uff0c\u5bf9\u6bcf\u4e2a\u89d2\u8272\u72ec\u7acb\u8bad\u7ec3\u8f7b\u91cf\u7ea7\u9002\u914d\u5668\u5c42\u3002',
    valueEn:
      'LoRA adapters are trained independently for each character with lightweight role-specific layers.',
  },
  {
    key: 'framework',
    icon: Layers3,
    titleZh: '\u670d\u52a1\u6846\u67b6',
    titleEn: 'Serving framework',
    valueZh:
      '\u661f\u6eaf\u6846\u67b6\u8d1f\u8d23\u6a21\u578b\u8def\u7531\u3001\u4e0a\u4e0b\u6587\u7ba1\u7406\u548c API \u54cd\u5e94\u5206\u53d1\u3002',
    valueEn:
      'The StarTrace framework handles routing, context management, and API response dispatch.',
  },
  {
    key: 'model-id',
    icon: Fingerprint,
    titleZh: '\u6a21\u578b\u7f16\u53f7\u89c4\u8303',
    titleEn: 'Model ID format',
    valueZh: 'StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7]',
    valueEn: 'StarTrace-[RoleCode]-[Version]',
    note: 'StarTrace-Zhongli-v1',
  },
]

const CALL_CHAIN = [
  {
    zh: '\u5f00\u53d1\u8005\u8bf7\u6c42',
    en: 'Developer request',
  },
  {
    zh: '\u661f\u6eaf\u5f00\u653e\u5e73\u53f0',
    en: 'Wangxi Open Platform',
  },
  {
    zh: '\u661f\u6eaf\u6846\u67b6',
    en: 'StarTrace Framework',
  },
  {
    zh: '\u661f\u6eaf\u5927\u6a21\u578b',
    en: 'StarTrace LLM',
  },
  {
    zh: '\u8fd4\u56de\u89d2\u8272\u5316\u56de\u590d',
    en: 'Role-tailored reply',
  },
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
              {text('\u6280\u672f\u67b6\u6784', 'Architecture')}
            </p>
            <h2 className='text-2xl leading-tight font-semibold md:text-4xl'>
              {text(
                '\u661f\u6eaf\u5927\u6a21\u578b(StarTrace LLM)\u6280\u672f\u67b6\u6784',
                'StarTrace LLM architecture'
              )}
            </h2>
          </div>
          <p className='text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base'>
            {text(
              '\u56f4\u7ed5\u89d2\u8272\u5316\u56de\u590d\u8bbe\u8ba1\u7684\u8def\u7531\u3001\u4e0a\u4e0b\u6587\u548c\u9002\u914d\u5668\u7ba1\u7406\u94fe\u8def\uff0c\u8ba9\u5f00\u53d1\u8005\u8bf7\u6c42\u7a33\u5b9a\u843d\u5230\u5bf9\u5e94\u89d2\u8272\u6a21\u578b\u3002',
              'A routing, context, and adapter management path designed for role-tailored replies.'
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
            <span>{text('\u8c03\u7528\u94fe\u8def', 'Invocation chain')}</span>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            {CALL_CHAIN.map((step, index) => (
              <div key={step.en} className='flex items-center gap-2'>
                <span className='border-border/70 bg-background rounded-lg border px-3 py-2 text-sm'>
                  {text(step.zh, step.en)}
                </span>
                {index < CALL_CHAIN.length - 1 && (
                  <span className='text-muted-foreground/45 font-mono text-xs'>
                    {'->'}
                  </span>
                )}
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
                      {item.note ? (
                        <p className='text-muted-foreground/70 mt-3 font-mono text-xs'>
                          e.g. {item.note}
                        </p>
                      ) : null}
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
