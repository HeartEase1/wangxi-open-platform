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
import { CherryStudio } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

import { HeroTerminalDemo } from '../hero-terminal-demo'

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
        'relative z-10 overflow-hidden px-6 pt-24 pb-14 md:pt-32 md:pb-20',
        props.className
      )}
    >
      <img
        src='/logo.png'
        alt=''
        aria-hidden='true'
        className='pointer-events-none absolute top-16 left-1/2 -z-10 size-[22rem] -translate-x-1/2 object-contain opacity-[0.07] md:top-10 md:size-[34rem] dark:opacity-[0.13]'
      />
      <div
        aria-hidden='true'
        className='border-border/30 pointer-events-none absolute inset-x-0 top-0 -z-20 h-px border-t'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_0%,transparent_70%)] bg-[size:4rem_4rem] opacity-[0.05]'
      />

      <div className='mx-auto flex max-w-6xl flex-col items-center text-center'>
        <div
          className='landing-animate-fade-up border-border/60 bg-background/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium opacity-0 shadow-xs backdrop-blur'
          style={{ animationDelay: '0ms' }}
        >
          <span className='bg-foreground size-1.5 rounded-full' />
          <span>
            {text(
              '\u5f80\u6614\u5f00\u653e\u5e73\u53f0',
              'Wangxi Open Platform'
            )}
          </span>
        </div>

        <h1
          className='landing-animate-fade-up mt-7 max-w-4xl text-4xl leading-tight font-semibold opacity-0 md:text-6xl'
          style={{ animationDelay: '60ms' }}
        >
          {text('往昔开放平台', 'Wangxi Open Platform')}
        </h1>

        <div
          className='landing-animate-fade-up mt-5 flex flex-col items-center gap-3 opacity-0'
          style={{ animationDelay: '120ms' }}
        >
          <p className='text-foreground text-xl font-medium md:text-2xl'>
            {text(
              '\u7edf\u4e00 AI \u6a21\u578b\u63a5\u5165',
              'Unified AI model access'
            )}
          </p>
          <blockquote className='text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg'>
            {text(
              '\u201c\u8ba9 AI \u63a5\u5165\u66f4\u7b80\u5355\u3001\u53ef\u9760\u3002\u201d',
              '"Simple, reliable AI access for developers."'
            )}
          </blockquote>
          <p className='text-muted-foreground/70 max-w-xl text-sm leading-relaxed'>
            {text(
              '\u2014\u2014\u5f80\u6614\u5f00\u653e\u5e73\u53f0\uff0c\u4e3a\u5f00\u53d1\u8005\u63d0\u4f9b\u7edf\u4e00\u3001\u53ef\u7ba1\u7406\u7684 AI \u63a5\u53e3\u3002',
              'Wangxi Open Platform provides unified, manageable AI APIs for developers.'
            )}
          </p>
          <div className='rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-100'>
            {text(
              '\u5f00\u653e\u3001\u53ef\u7ba1\u7406\u7684 AI \u6a21\u578b\u5e73\u53f0',
              'Open and manageable AI model platform'
            )}
          </div>
        </div>

        <div
          className='landing-animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0'
          style={{ animationDelay: '180ms' }}
        >
          {props.isAuthenticated ? (
            <Button
              className='group h-10 rounded-lg px-4 text-sm'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <Button
              className='group h-10 rounded-lg px-4 text-sm'
              render={<Link to='/sign-up' />}
            >
              {t('Get Started')}
              <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          )}
          {renderDocsButton()}
        </div>

        <div
          className='landing-animate-fade-up mt-12 w-full max-w-4xl opacity-0'
          style={{ animationDelay: '240ms' }}
        >
          <div className='border-border/50 flex flex-col gap-4 border-y py-5 md:flex-row md:items-center md:justify-between'>
            <div className='text-left'>
              <div className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
                {text(
                  '\u5e38\u7528\u5e94\u7528\u652f\u6301',
                  'Application support'
                )}
              </div>
              <p className='text-muted-foreground/75 mt-2 max-w-lg text-sm leading-relaxed'>
                {text(
                  '\u517c\u5bb9 Cherry Studio\u3001CC Switch \u4e0e OpenAI \u517c\u5bb9\u5ba2\u6237\u7aef\uff0c\u5e76\u63d0\u4f9b\u7edf\u4e00\u7684 API \u7ba1\u7406\u4e0e\u8c03\u7528\u5165\u53e3\u3002',
                  'Works with Cherry Studio, CC Switch, and OpenAI-compatible clients through one managed API platform.'
                )}
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-2.5'>
              <a
                href='https://cherry-ai.com'
                target='_blank'
                rel='noopener noreferrer'
                className='border-border/50 bg-background/75 hover:bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors'
              >
                <CherryStudio.Color size={20} className='shrink-0' />
                <span>Cherry Studio</span>
              </a>
              <a
                href='https://ccswitch.io'
                target='_blank'
                rel='noopener noreferrer'
                className='border-border/50 bg-background/75 hover:bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors'
              >
                <img
                  src='https://ccswitch.io/favicon.png'
                  alt=''
                  aria-hidden='true'
                  className='size-5 rounded object-contain'
                />
                <span>CC Switch</span>
              </a>
              <div className='border-border/50 bg-background/75 text-muted-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium'>
                <MoreHorizontal className='size-5' aria-hidden='true' />
                <span>{t('More Apps')}</span>
              </div>
            </div>
          </div>
        </div>

        <HeroTerminalDemo className='landing-animate-fade-up mt-10 opacity-0' />
      </div>
    </section>
  )
}
