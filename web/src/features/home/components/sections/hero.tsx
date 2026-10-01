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
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Wheat } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t, i18n } = useTranslation()
  const { status } = useStatus()
  const docsUrl = (status?.docs_link as string | undefined) || '/docs'
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  const renderDocsButton = () => {
    const isExternal = docsUrl.startsWith('http')
    const content = (
      <>
        <BookOpen className='size-4' aria-hidden='true' />
        <span>{t('Docs')}</span>
      </>
    )

    if (isExternal) {
      return (
        <Button
          variant='outline'
          className='h-10 rounded-lg px-4 text-sm'
          render={
            <a href={docsUrl} target='_blank' rel='noopener noreferrer' />
          }
        >
          {content}
        </Button>
      )
    }

    return (
      <Button
        variant='outline'
        className='h-10 rounded-lg px-4 text-sm'
        render={<Link to={docsUrl} />}
      >
        {content}
      </Button>
    )
  }

  return (
    <section
      className={cn(
        'relative z-10 flex min-h-[100svh] items-center overflow-hidden px-6 pt-24 pb-16 md:pt-28 md:pb-20',
        props.className
      )}
    >
      {/* Hero background image - 昔涟角色大图 */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-20'
        style={{
          backgroundImage: 'url(/hero-xilian.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Gradient overlay for text readability - 渐变遮罩确保文字可读 */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background: [
            'linear-gradient(90deg, color-mix(in srgb, var(--background) 98%, transparent) 0%, color-mix(in srgb, var(--background) 84%, transparent) 30%, transparent 68%)',
            'linear-gradient(to bottom, var(--background) 0%, transparent 22%, transparent 80%, var(--background) 100%)',
          ].join(', '),
        }}
      />
      <div
        aria-hidden='true'
        className='border-border/30 pointer-events-none absolute inset-x-0 top-0 -z-20 h-px border-t'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_0%,transparent_70%)] bg-[size:4rem_4rem] opacity-[0.03]'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-[5] overflow-hidden'
      >
        <span
          className='hero-firefly absolute top-[28%] left-[74%] size-2 md:size-2.5'
          style={{ animationDelay: '-2.4s', animationDuration: '16s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-lime-200/80 shadow-[0_0_14px_5px_rgba(190,242,100,0.46)]'
            style={{ animationDelay: '-2.4s', animationDuration: '5.8s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[44%] left-[84%] size-1.5 md:size-2'
          style={{ animationDelay: '-5s', animationDuration: '18s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-emerald-200/75 shadow-[0_0_13px_5px_rgba(110,231,183,0.4)]'
            style={{ animationDelay: '-5s', animationDuration: '6.4s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[58%] left-[79%] size-2 md:size-2.5'
          style={{ animationDelay: '-1.6s', animationDuration: '15s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-yellow-200/80 shadow-[0_0_16px_6px_rgba(253,224,71,0.44)]'
            style={{ animationDelay: '-1.6s', animationDuration: '5.2s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[38%] left-[92%] size-1.5 md:size-2'
          style={{ animationDelay: '-4.1s', animationDuration: '19s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-cyan-100/70 shadow-[0_0_13px_5px_rgba(103,232,249,0.38)]'
            style={{ animationDelay: '-4.1s', animationDuration: '6.8s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[72%] left-[88%] size-1.5 md:size-2'
          style={{ animationDelay: '-3.2s', animationDuration: '17s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-orange-100/70 shadow-[0_0_13px_5px_rgba(251,146,60,0.4)]'
            style={{ animationDelay: '-3.2s', animationDuration: '6s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[66%] left-[96%] size-1.5 md:size-2'
          style={{ animationDelay: '-6.2s', animationDuration: '20s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-teal-100/70 shadow-[0_0_13px_5px_rgba(94,234,212,0.38)]'
            style={{ animationDelay: '-6.2s', animationDuration: '7.2s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[50%] left-[70%] size-1 md:size-1.5'
          style={{ animationDelay: '-0.8s', animationDuration: '14s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-lime-100/70 shadow-[0_0_11px_4px_rgba(190,242,100,0.34)]'
            style={{ animationDelay: '-0.8s', animationDuration: '5.6s' }}
          />
        </span>
        <span
          className='hero-firefly absolute top-[80%] left-[81%] size-1 md:size-1.5'
          style={{ animationDelay: '-7s', animationDuration: '18s' }}
        >
          <span
            className='hero-firefly-core size-full rounded-full bg-sky-100/65 shadow-[0_0_11px_4px_rgba(125,211,252,0.34)]'
            style={{ animationDelay: '-7s', animationDuration: '6.6s' }}
          />
        </span>
      </div>

      <div className='mx-auto flex w-full max-w-6xl flex-col items-start text-left'>
        <div
          className='landing-animate-fade-up border-border/60 bg-background/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium opacity-0 shadow-xs backdrop-blur'
          style={{ animationDelay: '0ms' }}
        >
          <Wheat className='text-primary size-4' aria-hidden='true' />
          <span>
            {text(
              '\u5f80\u6614\u5f00\u653e\u5e73\u53f0',
              'Wangxi Open Platform'
            )}
          </span>
        </div>

        <h1
          className='landing-animate-fade-up mt-7 max-w-3xl text-5xl leading-[1.08] font-semibold tracking-tight opacity-0 md:text-7xl lg:text-[5.25rem]'
          style={{ animationDelay: '60ms' }}
        >
          {text('往昔开放平台', 'Wangxi Open Platform')}
        </h1>

        <div
          className='landing-animate-fade-up mt-7 flex max-w-2xl flex-col items-start gap-4 opacity-0'
          style={{ animationDelay: '120ms' }}
        >
          <p className='text-foreground text-2xl font-medium md:text-3xl'>
            {text(
              '\u8fd0\u884c\u5e1d\u7687\u6743\u6756\uff0c\u63a5\u5165\u7edf\u4e00\u7b97\u529b',
              "Run Emperor's Scepter with unified compute"
            )}
          </p>
          <blockquote className='text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl'>
            {text(
              '\u201c\u5e1d\u7687\u6743\u6756\u7b97\u529b\u652f\u6301\uff0c\u8ba9\u6bcf\u6b21\u8c03\u7528\u90fd\u66f4\u7a33\u5b9a\u3002\u201d',
              '"Emperor\'s Scepter compute support for every reliable call."'
            )}
          </blockquote>
          <p className='text-muted-foreground/80 max-w-2xl text-base leading-relaxed md:text-lg'>
            {text(
              '\u2014\u2014\u5f80\u6614\u5f00\u653e\u5e73\u53f0\uff0c\u4e3a\u5f00\u53d1\u8005\u63d0\u4f9b\u7a33\u5b9a\u3001\u53ef\u7ba1\u7406\u7684\u5e1d\u7687\u6743\u6756\u7b97\u529b\u63a5\u53e3\u3002',
              "Wangxi Open Platform provides stable, manageable Emperor's Scepter compute APIs."
            )}
          </p>
          <div className='border-primary/25 bg-primary/10 text-primary rounded-full border px-5 py-2.5 text-base font-semibold'>
            {text(
              '\u5e1d\u7687\u6743\u6756\u7b97\u529b\u652f\u6301 \u00b7 \u5f00\u653e\u53ef\u7ba1\u7406',
              "Emperor's Scepter compute support · Open and manageable"
            )}
          </div>
        </div>

        <div
          className='landing-animate-fade-up mt-9 flex flex-wrap items-center gap-3 opacity-0'
          style={{ animationDelay: '180ms' }}
        >
          {props.isAuthenticated ? (
            <Button
              className='group h-11 rounded-lg px-5 text-base'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <Button
              className='group h-11 rounded-lg px-5 text-base'
              render={<Link to='/sign-up' />}
            >
              {t('Get Started')}
              <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          )}
          {renderDocsButton()}
        </div>
      </div>
    </section>
  )
}
