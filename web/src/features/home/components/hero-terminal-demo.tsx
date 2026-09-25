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
import { CheckCircle2, CornerDownRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

const REQUEST_LINES = [
  'curl -X POST "/v1/chat/completions" \\',
  '  -H "Authorization: Bearer sk-..." \\',
  '  -H "Content-Type: application/json" \\',
  "  -d '{",
  '    "model": "StarTrace-Zhongli-v1",',
  '    "metadata": {',
  '      "conversation_id": "startrace-conv-001"',
  '    },',
  '    "messages": [',
  '      { "role": "user", "content": "..." }',
  '    ]',
  "  }'",
]

const RESPONSE_LINES = [
  '{',
  '  "model": "StarTrace-Zhongli-v1",',
  '  "reply": "\u89d2\u8272\u5316\u56de\u590d\u5df2\u751f\u6210\u3002",',
  '  "trace": "StarTrace Framework"',
  '}',
]

const ROUTE_STEPS = [
  {
    zh: '\u5f00\u53d1\u8005\u8bf7\u6c42',
    en: 'Developer request',
  },
  {
    zh: '\u661f\u6eaf\u5f00\u653e\u5e73\u53f0',
    en: 'StarTrace platform',
  },
  {
    zh: '\u661f\u6eaf\u6846\u67b6',
    en: 'StarTrace framework',
  },
  {
    zh: '\u661f\u6eaf\u5927\u6a21\u578b',
    en: 'StarTrace LLM',
  },
  {
    zh: '\u89d2\u8272\u5316\u56de\u590d',
    en: 'Role reply',
  },
]

interface HeroTerminalDemoProps {
  className?: string
}

export function HeroTerminalDemo(props: HeroTerminalDemoProps) {
  const { t, i18n } = useTranslation()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  return (
    <div className={cn('mx-auto w-full max-w-5xl', props.className)}>
      <div className='border-border/60 bg-card/80 overflow-hidden rounded-xl border shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur'>
        <div className='border-border/50 flex flex-col gap-3 border-b px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5'>
          <div className='flex min-w-0 items-center gap-3 text-left'>
            <span className='bg-success/10 text-success flex size-9 shrink-0 items-center justify-center rounded-lg'>
              <CheckCircle2 className='size-4' aria-hidden='true' />
            </span>
            <div className='min-w-0'>
              <div className='truncate text-sm font-semibold'>
                {text(
                  '\u661f\u6eaf\u8def\u7531\u9884\u89c8',
                  'StarTrace route preview'
                )}
              </div>
              <div className='text-muted-foreground truncate font-mono text-xs'>
                StarTrace-Zhongli-v1
              </div>
            </div>
          </div>
          <div className='text-muted-foreground flex flex-wrap items-center gap-2 font-mono text-xs'>
            <span className='rounded-md border px-2 py-1'>POST</span>
            <span>/v1/chat/completions</span>
          </div>
        </div>

        <div className='grid md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]'>
          <section className='px-4 py-4 text-left md:px-5'>
            <SectionLabel>{text('\u8bf7\u6c42', 'Request')}</SectionLabel>
            <div className='bg-muted/35 mt-3 overflow-x-auto rounded-lg p-4 font-mono text-xs leading-6'>
              {REQUEST_LINES.map((line) => (
                <code
                  key={line}
                  className='text-muted-foreground block whitespace-pre'
                >
                  {line}
                </code>
              ))}
            </div>
          </section>

          <section className='border-border/50 bg-muted/20 border-t px-4 py-4 text-left md:border-t-0 md:border-l md:px-5'>
            <SectionLabel>{text('\u56de\u590d', 'Response')}</SectionLabel>
            <div className='mt-3 space-y-4'>
              <div className='bg-background/70 overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-6'>
                {RESPONSE_LINES.map((line) => (
                  <code
                    key={line}
                    className='text-muted-foreground block whitespace-pre'
                  >
                    {line}
                  </code>
                ))}
              </div>
              <div className='text-muted-foreground flex items-start gap-2 text-xs leading-relaxed'>
                <CornerDownRight
                  className='mt-0.5 size-4 shrink-0'
                  aria-hidden='true'
                />
                <span>
                  {text(
                    'metadata.conversation_id \u7528\u4e8e\u7a33\u5b9a\u7ed1\u5b9a\u4f1a\u8bdd\u4e0a\u4e0b\u6587\uff1b\u8bf7\u6c42\u7531\u661f\u6eaf\u6846\u67b6\u63a5\u7ba1\u6a21\u578b\u8def\u7531\uff0c\u8fd4\u56de\u89d2\u8272\u5316\u56de\u590d\u3002',
                    'metadata.conversation_id keeps conversation context stable while the StarTrace framework handles model routing and returns a role-tailored reply.'
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className='border-border/50 bg-background/50 flex flex-wrap items-center justify-center gap-2 border-t px-4 py-3'>
          {ROUTE_STEPS.map((step, index) => (
            <div key={step.en} className='flex items-center gap-2'>
              <span className='text-muted-foreground bg-card rounded-md border px-2.5 py-1 text-xs'>
                {text(step.zh, step.en)}
              </span>
              {index < ROUTE_STEPS.length - 1 && (
                <span className='text-muted-foreground/45 font-mono text-xs'>
                  {'->'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionLabel(props: { children: ReactNode }) {
  return (
    <span className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
      {props.children}
    </span>
  )
}
