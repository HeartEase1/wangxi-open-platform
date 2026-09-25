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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t, i18n } = useTranslation()
  const text = (zh: string, en: string) =>
    i18n.language.startsWith('zh') ? zh : t(en)

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section
      className={cn(
        'border-border/40 relative z-10 border-t px-6 py-20 md:py-24',
        props.className
      )}
    >
      <AnimateInView className='mx-auto flex max-w-3xl flex-col items-center text-center'>
        <h2 className='text-2xl leading-tight font-semibold md:text-4xl'>
          {text(
            '\u5f00\u59cb\u63a5\u5165\u661f\u6eaf\u5927\u6a21\u578b',
            'Start building with StarTrace LLM'
          )}
        </h2>
        <p className='text-muted-foreground/80 mx-auto mt-5 max-w-xl text-sm leading-relaxed md:text-base'>
          {text(
            '\u521b\u5efa API Key \u540e\uff0c\u5373\u53ef\u901a\u8fc7\u517c\u5bb9\u63a5\u53e3\u8bf7\u6c42 StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7] \u6a21\u578b\u3002',
            'Create an API key, then request StarTrace-[RoleCode]-[Version] models through the compatible API.'
          )}
        </p>
        <div className='mt-8 flex items-center justify-center'>
          <Button className='group rounded-lg' render={<Link to='/sign-up' />}>
            {t('Get Started')}
            <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
        </div>
      </AnimateInView>
    </section>
  )
}
