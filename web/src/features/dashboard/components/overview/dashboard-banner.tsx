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

import { useSystemConfig } from '@/hooks/use-system-config'
import { DEFAULT_SYSTEM_NAME } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

export function DashboardBanner() {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const user = useAuthStore((state) => state.auth.user)

  return (
    <div className='border-primary/15 relative overflow-hidden rounded-2xl border shadow-sm'>
      <div className='relative h-[160px] w-full sm:h-[175px] lg:h-[190px]'>
        <img
          src='/hero-xilian.png'
          alt=''
          aria-hidden='true'
          className='size-full object-cover object-[center_10%]'
          loading='eager'
        />
        <div className='from-background/95 via-background/72 absolute inset-0 bg-gradient-to-r to-transparent' />
        <div className='absolute inset-y-0 left-0 flex max-w-[72%] flex-col justify-center px-5 py-4 sm:max-w-[52%] sm:px-8 sm:py-5 md:px-10'>
          <p className='text-primary text-xs font-semibold tracking-[0.24em] uppercase'>
            {systemName || DEFAULT_SYSTEM_NAME}
          </p>
          <h2 className='text-foreground mt-2 text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl'>
            {t('Welcome back!')}
          </h2>
          <p className='text-muted-foreground mt-1 truncate text-sm sm:text-base'>
            {user?.display_name || user?.username || t('Developer')}
          </p>
          <p className='text-muted-foreground/80 mt-2 hidden max-w-sm text-xs leading-relaxed sm:block'>
            {t(
              'Manage your models, keys, channels, and wheat usage in one place.'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
