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
import { useQuery } from '@tanstack/react-query'
import { Activity, CalendarDays, Hash, Sparkles, Users } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { getHomeStats } from '@/features/home/api'
import type {
  HomeStatsData,
  HomeStatsLeaderboardItem,
  HomeStatsPeriod,
} from '@/features/home/types'
import { formatCompactNumber, formatNumber } from '@/lib/format'

const EMPTY_PERIOD: HomeStatsPeriod = {
  tokens: 0,
  requests: 0,
  top_users: [],
}

const EMPTY_HOME_STATS: HomeStatsData = {
  today: EMPTY_PERIOD,
  last_30_days: EMPTY_PERIOD,
  total_registered_users: 0,
}

function MetricCard(props: {
  title: string
  value: number
  unitLabel: string
  icon: ComponentType<{ className?: string }>
  loading?: boolean
}) {
  const Icon = props.icon

  return (
    <div className='bg-muted/35 rounded-xl border px-3 py-3'>
      <div className='text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium'>
        <Icon className='size-3.5 shrink-0' aria-hidden='true' />
        <span className='truncate'>{props.title}</span>
      </div>
      {props.loading ? (
        <>
          <Skeleton className='mt-2 h-7 w-20' />
          <Skeleton className='mt-1.5 h-3.5 w-24' />
        </>
      ) : (
        <>
          <div className='mt-2 font-mono text-xl font-semibold tracking-tight tabular-nums'>
            {formatCompactNumber(props.value)}
          </div>
          <div className='text-muted-foreground mt-1 text-xs tabular-nums'>
            {formatNumber(props.value)} {props.unitLabel}
          </div>
        </>
      )}
    </div>
  )
}

function LeaderboardPanel(props: {
  title: string
  description: string
  items: HomeStatsLeaderboardItem[]
  loading?: boolean
}) {
  const { t, i18n } = useTranslation()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  return (
    <div className='overflow-hidden rounded-xl border'>
      <div className='flex items-center justify-between gap-3 border-b px-4 py-3'>
        <div className='min-w-0'>
          <div className='truncate text-sm font-semibold'>{props.title}</div>
          <div className='text-muted-foreground truncate text-xs'>
            {props.description}
          </div>
        </div>
        <div className='text-muted-foreground text-xs'>
          {text('按 Token 用量排名', 'By token usage')}
        </div>
      </div>

      <div className='divide-y'>
        {props.loading &&
          ['first', 'second', 'third', 'fourth', 'fifth'].map((slot) => (
            <div
              key={slot}
              className='flex items-center justify-between gap-3 px-4 py-3'
            >
              <div className='flex min-w-0 flex-1 items-center gap-3'>
                <Skeleton className='h-5 w-6' />
                <div className='min-w-0 flex-1'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='mt-1.5 h-3 w-16' />
                </div>
              </div>
              <div className='text-right'>
                <Skeleton className='ml-auto h-4 w-20' />
                <Skeleton className='mt-1.5 ml-auto h-3 w-16' />
              </div>
            </div>
          ))}
        {!props.loading && props.items.length === 0 && (
          <div className='text-muted-foreground px-4 py-6 text-sm'>
            {text(
              '当前时间范围内暂无调用数据。',
              'No usage data available for this time range.'
            )}
          </div>
        )}
        {!props.loading &&
          props.items.map((item, index) => (
            <div
              key={item.username}
              className='flex items-center justify-between gap-3 px-4 py-3'
            >
              <div className='flex min-w-0 flex-1 items-center gap-3'>
                <div className='text-muted-foreground w-6 text-sm font-medium tabular-nums'>
                  {index + 1}
                </div>
                <div className='min-w-0'>
                  <div className='truncate text-sm font-medium'>
                    {item.username}
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    {formatNumber(item.requests)} {text('请求', 'requests')}
                  </div>
                </div>
              </div>

              <div className='text-right'>
                <div className='font-mono text-sm font-semibold tabular-nums'>
                  {formatNumber(item.tokens)}
                </div>
                <div className='text-muted-foreground text-xs'>
                  {text('Token', 'tokens')}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export function UsageOverviewPanel() {
  const { t, i18n } = useTranslation()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  const statsQuery = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      const result = await getHomeStats()
      return result.success
        ? (result.data ?? EMPTY_HOME_STATS)
        : EMPTY_HOME_STATS
    },
    staleTime: 60 * 1000,
  })

  const stats = statsQuery.data ?? EMPTY_HOME_STATS
  const metricsLoading = statsQuery.isLoading

  return (
    <section className='bg-card overflow-hidden rounded-2xl border shadow-xs'>
      <div className='flex items-center gap-2 border-b px-4 py-3 sm:px-5'>
        <Sparkles
          className='text-muted-foreground/60 size-4 shrink-0'
          aria-hidden='true'
        />
        <h3 className='text-sm font-semibold'>
          {text('调用量概览', 'Call volume overview')}
        </h3>
        <span className='text-muted-foreground ml-auto text-xs'>
          {text('今日与近 30 天', 'Today and the last 30 days')}
        </span>
      </div>

      <div className='space-y-4 p-4 sm:p-5'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-5'>
          <MetricCard
            title={text('近 30 天 Token', 'Last 30 days tokens')}
            value={stats.last_30_days.tokens}
            unitLabel={text('Token', 'tokens')}
            icon={CalendarDays}
            loading={metricsLoading}
          />
          <MetricCard
            title={text('近 30 天请求数', 'Last 30 days requests')}
            value={stats.last_30_days.requests}
            unitLabel={text('请求', 'requests')}
            icon={Activity}
            loading={metricsLoading}
          />
          <MetricCard
            title={text('今日 Token', 'Today tokens')}
            value={stats.today.tokens}
            unitLabel={text('Token', 'tokens')}
            icon={Hash}
            loading={metricsLoading}
          />
          <MetricCard
            title={text('今日请求数', 'Today requests')}
            value={stats.today.requests}
            unitLabel={text('请求', 'requests')}
            icon={Activity}
            loading={metricsLoading}
          />
          <MetricCard
            title={text('总注册人数', 'Total registered users')}
            value={stats.total_registered_users}
            unitLabel={text('用户', 'users')}
            icon={Users}
            loading={metricsLoading}
          />
        </div>

        <div className='grid gap-4 xl:grid-cols-2'>
          <LeaderboardPanel
            title={text(
              '近 30 天 Token Top 10 用户',
              'Top 10 users in the last 30 days'
            )}
            description={text(
              '按累计 Token 用量排序',
              'Ranked by total token usage'
            )}
            items={stats.last_30_days.top_users}
            loading={metricsLoading}
          />
          <LeaderboardPanel
            title={text('今日 Token Top 10 用户', 'Top 10 users today')}
            description={text(
              '按累计 Token 用量排序',
              'Ranked by total token usage'
            )}
            items={stats.today.top_users}
            loading={metricsLoading}
          />
        </div>
      </div>
    </section>
  )
}
