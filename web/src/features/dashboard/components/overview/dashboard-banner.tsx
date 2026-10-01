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

export function DashboardBanner() {
  return (
    <div className='border-primary/15 relative overflow-hidden rounded-3xl border shadow-sm'>
      <div className='relative aspect-[16/6] w-full sm:aspect-[16/5] lg:aspect-[16/4.5]'>
        <img
          src='/dashboard-banner.png'
          alt=''
          aria-hidden='true'
          className='size-full object-cover object-[center_42%]'
          loading='eager'
        />
        <div className='from-background/65 absolute inset-0 bg-gradient-to-t via-transparent to-transparent' />
      </div>
    </div>
  )
}
