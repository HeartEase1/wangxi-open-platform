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

import { Badge } from '@/components/ui/badge'
import { TitledCard } from '@/components/ui/titled-card'
import type { UserProfile } from '@/features/profile/types'

type PrivacyCardProps = {
  profile: UserProfile
  onUpdate: () => void
}

export function PrivacyCard(_props: PrivacyCardProps) {
  const { t } = useTranslation()
  return (
    <TitledCard
      title={t('Record IP Address')}
      description={t(
        'Usage and error logs always record the client IP address and this setting cannot be turned off.'
      )}
      disableHoverEffect
    >
      <Badge variant='secondary'>{t('Always On')}</Badge>
    </TitledCard>
  )
}
