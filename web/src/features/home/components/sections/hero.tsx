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
        'relative z-10 flex min-h-[clamp(38rem,82vh,52rem)] items-center overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24',
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

      <div className='mx-auto flex w-full max-w-6xl flex-col items-start text-left'>
        <div
          className='landing-animate-fade-up border-border/60 bg-background/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium opacity-0 shadow-xs backdrop-blur'
          style={{ animationDelay: '0ms' }}
        >
          <Wheat className='text-primary size-3.5' aria-hidden='true' />
          <span>
            {text(
              '\u5f80\u6614\u5f00\u653e\u5e73\u53f0',
              'Wangxi Open Platform'
            )}
          </span>
        </div>

        <h1
          className='landing-animate-fade-up mt-7 max-w-2xl text-4xl leading-tight font-semibold tracking-tight opacity-0 md:text-6xl'
          style={{ animationDelay: '60ms' }}
        >
          {text('往昔开放平台', 'Wangxi Open Platform')}
        </h1>

        <div
          className='landing-animate-fade-up mt-5 flex max-w-xl flex-col items-start gap-3 opacity-0'
          style={{ animationDelay: '120ms' }}
        >
          <p className='text-foreground text-xl font-medium md:text-2xl'>
            {text(
              '\u7edf\u4e00 AI \u6a21\u578b\u63a5\u5165',
              'Unified AI model access'
            )}
          </p>
          <blockquote className='text-muted-foreground max-w-xl text-base leading-relaxed md:text-lg'>
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
          <div className='border-primary/25 bg-primary/10 text-primary rounded-full border px-4 py-2 text-sm font-semibold'>
            {text(
              '\u5f00\u653e\u3001\u53ef\u7ba1\u7406\u7684 AI \u6a21\u578b\u5e73\u53f0',
              'Open and manageable AI model platform'
            )}
          </div>
        </div>

        <div
          className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
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
      </div>
    </section>
  )
}
