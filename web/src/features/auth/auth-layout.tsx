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
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div className='bg-background text-foreground relative min-h-svh overflow-x-hidden overflow-y-auto'>
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        <img
          src='/dashboard-banner.png'
          alt=''
          className='absolute inset-0 size-full object-cover object-[center_42%]'
        />
        <div className='absolute inset-0 bg-slate-950/35 dark:bg-slate-950/55' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.18),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(56,189,248,0.2),transparent_38%),linear-gradient(120deg,rgba(15,23,42,0.78),rgba(15,23,42,0.25)_50%,rgba(15,23,42,0.72))]' />
        <div className='bg-background/10 absolute inset-0 backdrop-blur-[1px]' />
      </div>

      <Link
        to='/'
        className='bg-background/55 absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-white/25 px-3 py-2 shadow-lg shadow-black/10 backdrop-blur-xl transition-opacity hover:opacity-80 sm:top-7 sm:left-7 lg:top-8 lg:left-8'
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

      <div className='relative z-10 flex min-h-svh items-center justify-center px-4 pt-24 pb-10 sm:px-8 sm:pt-28 sm:pb-14'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.14),transparent_34%)]' />
        <div className='relative w-full max-w-[500px]'>
          <div className='mb-5 px-2 text-center text-white sm:mb-6'>
            <p className='text-[0.68rem] font-semibold tracking-[0.32em] text-white/70 uppercase'>
              {systemName}
            </p>
            <p className='mt-2 text-sm text-white/75'>
              {t('A calm workspace for your AI model journey.')}
            </p>
          </div>
          <div className='bg-background/78 dark:bg-card/68 relative rounded-[2rem] border border-white/35 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:p-9'>
            <div className='from-primary/20 pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r via-sky-300/40 to-transparent' />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
