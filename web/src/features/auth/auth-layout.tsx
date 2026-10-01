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
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { i18n, t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  return (
    <div className='relative min-h-svh overflow-x-hidden overflow-y-auto bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white'>
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        <img
          src='/dashboard-banner.png'
          alt=''
          className='absolute inset-0 size-full object-cover object-[center_42%] opacity-90 dark:opacity-75'
        />
        <div className='absolute inset-0 bg-white/45 dark:hidden' />
        <div className='absolute inset-0 hidden bg-slate-950/55 dark:block' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(250,204,21,0.24),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(56,189,248,0.22),transparent_38%),linear-gradient(120deg,rgba(255,252,240,0.62),rgba(240,249,255,0.14)_52%,rgba(231,245,235,0.55))] dark:hidden' />
        <div className='absolute inset-0 hidden bg-[radial-gradient(circle_at_16%_18%,rgba(250,204,21,0.16),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(56,189,248,0.18),transparent_38%),linear-gradient(120deg,rgba(15,23,42,0.85),rgba(15,23,42,0.24)_52%,rgba(32,18,60,0.78))] dark:block' />
        <div className='absolute inset-0 bg-white/10 backdrop-blur-[1px] dark:bg-slate-950/10' />
      </div>

      <Link
        to='/'
        className='absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-2 text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur-xl transition-opacity hover:opacity-80 sm:top-7 sm:left-7 lg:top-8 lg:left-8 dark:border-white/20 dark:bg-slate-950/55 dark:text-white'
      >
        <div className='relative h-8 w-8'>
          {loading ? (
            <Skeleton className='absolute inset-0 rounded-full' />
          ) : (
            <img
              src={logo}
              alt={t('Logo')}
              className='h-8 w-8 rounded-full object-cover'
            />
          )}
        </div>
        {loading ? (
          <Skeleton className='h-5 w-24' />
        ) : (
          <h1 className='text-sm font-semibold tracking-tight'>{systemName}</h1>
        )}
      </Link>

      <main className='relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-center px-4 pt-24 pb-10 sm:px-8 sm:pt-28 sm:pb-14 lg:px-12'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_44%,rgba(255,255,255,0.24),transparent_32%)] dark:bg-[radial-gradient(circle_at_48%_44%,rgba(167,139,250,0.16),transparent_32%)]' />
        <div className='relative grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,32rem)] lg:gap-20'>
          <div className='hidden max-w-xl px-3 lg:block'>
            <div className='inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-white/75'>
              {systemName}
            </div>
            <h2 className='mt-6 text-4xl leading-tight font-semibold tracking-tight text-slate-950 xl:text-5xl dark:text-white'>
              {text(
                '\u8fd0\u884c\u5e1d\u7687\u6743\u6756\uff0c\u8ba9\u6bcf\u4e00\u6b21\u8c03\u7528\u90fd\u6709\u7a33\u5b9a\u7684\u7b97\u529b\u652f\u6301\u3002',
                "Run Emperor's Scepter with dependable compute support."
              )}
            </h2>
            <p className='mt-5 max-w-lg text-base leading-8 text-slate-700/85 dark:text-white/70'>
              {text(
                '\u7edf\u4e00\u7ba1\u7406\u6a21\u578b\u3001\u5bc6\u94a5\u3001\u6e20\u9053\u4e0e\u9ea6\u5b50\u7528\u91cf\uff0c\u5728\u5f80\u6614\u5e73\u53f0\u4e2d\u4ece\u5bb9\u8c03\u5ea6\u3002',
                'Manage models, keys, channels, and wheat usage in one calm workspace.'
              )}
            </p>
            <div className='mt-8 flex flex-wrap gap-2 text-sm text-slate-700/80 dark:text-white/70'>
              <span className='rounded-full border border-slate-900/10 bg-white/45 px-3 py-1.5 backdrop-blur dark:border-white/15 dark:bg-white/10'>
                {text(
                  '\u5e1d\u7687\u6743\u6756\u63a5\u5165',
                  "Emperor's Scepter access"
                )}
              </span>
              <span className='rounded-full border border-slate-900/10 bg-white/45 px-3 py-1.5 backdrop-blur dark:border-white/15 dark:bg-white/10'>
                {text(
                  '\u9ea6\u5b50\u7528\u91cf\u6d1e\u5bdf',
                  'Wheat usage insights'
                )}
              </span>
            </div>
          </div>

          <div className='relative w-full max-w-[500px] lg:justify-self-end'>
            <div className='relative rounded-[2rem] border border-white/65 bg-white/80 p-6 text-slate-900 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:p-9 dark:border-white/20 dark:bg-slate-950/68 dark:text-white'>
              <div className='pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-amber-400/70 via-sky-300/70 to-transparent dark:from-violet-300/70 dark:via-sky-300/65' />
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
