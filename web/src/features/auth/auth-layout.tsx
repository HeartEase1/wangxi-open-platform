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
    <div className='bg-background text-foreground relative min-h-svh overflow-hidden'>
      <Link
        to='/'
        className='absolute top-4 left-4 z-20 flex items-center gap-2 transition-opacity hover:opacity-80 sm:top-8 sm:left-8 lg:top-7 lg:right-8 lg:left-auto'
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
          <Skeleton className='h-6 w-24' />
        ) : (
          <h1 className='text-xl font-medium'>{systemName}</h1>
        )}
      </Link>

      <div className='grid min-h-svh lg:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)]'>
        <div className='relative hidden overflow-hidden lg:flex'>
          <img
            src='/dashboard-banner.png'
            alt=''
            aria-hidden='true'
            className='absolute inset-0 size-full object-cover object-[center_38%]'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/5' />
          <div className='relative z-10 mt-auto max-w-2xl p-12 xl:p-16'>
            <p className='text-xs font-semibold tracking-[0.28em] text-white/75 uppercase'>
              {systemName}
            </p>
            <h2 className='mt-4 text-3xl font-semibold tracking-tight text-white xl:text-4xl'>
              {t(
                'A focused home for keys, balance, routing, and service health.'
              )}
            </h2>
            <p className='mt-4 max-w-lg text-sm leading-7 text-white/70'>
              {t(
                'Manage your models, keys, channels, and wheat usage in one place.'
              )}
            </p>
          </div>
        </div>

        <div className='relative flex min-h-svh items-center justify-center px-4 pt-20 pb-10 sm:px-8 sm:pt-24 sm:pb-12'>
          <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklch,var(--chart-4)_10%,transparent),transparent_48%)]' />
          <div className='bg-card/90 relative w-full max-w-[480px] rounded-3xl border p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8 lg:p-10 dark:shadow-black/20'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
