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
import { useTranslation } from 'react-i18next'

type ArchitectureItem =
  | {
      key: string
      titleZh: string
      titleEn: string
      value: string
      note?: string
    }
  | {
      key: string
      titleZh: string
      titleEn: string
      valueZh: string
      valueEn: string
      note?: string
    }

const ARCHITECTURE_ITEMS: ArchitectureItem[] = [
  {
    key: 'base-model',
    titleZh: '\u57fa\u5ea7\u6a21\u578b',
    titleEn: 'Base model',
    value: 'Qwen3.5-27B',
  },
  {
    key: 'fine-tune',
    titleZh: '\u5fae\u8c03\u65b9\u6848',
    titleEn: 'Fine-tuning',
    valueZh:
      '\u57fa\u4e8e LoRA\uff08\u4f4e\u79e9\u9002\u914d\uff09\u6280\u672f\uff0c\u5bf9\u6bcf\u4e2a\u89d2\u8272\u72ec\u7acb\u8bad\u7ec3\u8f7b\u91cf\u7ea7\u9002\u914d\u5668\u5c42\u3002',
    valueEn:
      'LoRA adapters are trained independently for each character with lightweight role-specific layers.',
  },
  {
    key: 'framework',
    titleZh: '\u670d\u52a1\u6846\u67b6',
    titleEn: 'Serving framework',
    valueZh:
      '\u661f\u6eaf\u6846\u67b6\u8d1f\u8d23\u6a21\u578b\u8def\u7531\u3001\u4e0a\u4e0b\u6587\u7ba1\u7406\u548c API \u54cd\u5e94\u5206\u53d1\u3002',
    valueEn:
      'The StarTrace framework handles routing, context, and API response dispatch.',
  },
  {
    key: 'naming',
    titleZh: '\u6a21\u578b\u7f16\u53f7\u89c4\u8303',
    titleEn: 'Model naming',
    value: 'StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7]',
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
    en: 'StarTrace Open Platform',
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
    zh: '\u89d2\u8272\u5316\u56de\u590d',
    en: 'Role-tailored reply',
  },
]

export function StarTraceLLMSection() {
  const { t, i18n } = useTranslation()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  return (
    <section className='relative z-10 px-6 pb-4 md:pb-8'>
      <div className='mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-xs'>
        <div className='grid gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8'>
          <div className='space-y-5'>
            <div className='inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-200'>
              {text(
                '\u661f\u6eaf\u5927\u6a21\u578b(StarTrace LLM)',
                'StarTrace LLM'
              )}
            </div>
            <div className='space-y-3'>
              <h2 className='text-2xl font-semibold tracking-tight md:text-3xl'>
                {text(
                  '\u201c\u661f\u6eaf\u5927\u6a21\u578b\uff0c\u8ba9\u6bcf\u4e2a\u89d2\u8272\u90fd\u6709\u7075\u9b42\u3002\u201d',
                  '"StarTrace LLM gives every character a soul."'
                )}
              </h2>
              <p className='text-muted-foreground/75 text-sm leading-relaxed md:text-base'>
                {text(
                  '\u2014\u2014\u661f\u9645\u548c\u5e73\u516c\u53f8\u00b7\u5f80\u6614\u9879\u76ee\u7ec4\uff0c\u6355\u6349\u6570\u5b57\u661f\u5c18\u4e2d\u7684\u4eba\u5f71\u3002',
                  'Echoes Team, Interastral Peace Corporation. Capturing silhouettes in digital stardust.'
                )}
              </p>
              <p className='inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-800 dark:text-amber-100'>
                {text(
                  'StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7]\u7cfb\u5217\u5b8c\u5168\u516c\u76ca\u514d\u8d39',
                  'StarTrace-[RoleCode]-[Version] series is fully public-benefit and free'
                )}
              </p>
            </div>

            <div className='rounded-2xl border bg-muted/30 p-4'>
              <div className='text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase'>
                {text('\u8c03\u7528\u94fe\u8def', 'Invocation chain')}
              </div>
              <div className='mt-3 flex flex-wrap items-center gap-2'>
                {CALL_CHAIN.map((step, index) => (
                  <div key={step.en} className='contents'>
                    <span className='rounded-full border bg-background px-3 py-1 text-sm'>
                      {text(step.zh, step.en)}
                    </span>
                    {index < CALL_CHAIN.length - 1 && (
                      <span className='text-muted-foreground/50 text-sm'>
                        {'->'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            {ARCHITECTURE_ITEMS.map((item) => (
              <article
                key={item.key}
                className='rounded-2xl border bg-background/80 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]'
              >
                <div className='text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase'>
                  {text(item.titleZh, item.titleEn)}
                </div>
                <div className='mt-3 text-base font-semibold leading-relaxed'>
                  {'valueZh' in item
                    ? text(item.valueZh, item.valueEn)
                    : item.value}
                </div>
                {'note' in item && item.note ? (
                  <div className='text-muted-foreground mt-2 text-xs'>
                    e.g. {item.note}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
