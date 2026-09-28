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
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  // The shared test setup initializes its own English instance. Give the real
  // application config a fresh i18next instance, as on a browser page load.
  vi.doMock('i18next', async (importOriginal) => {
    const actual = await importOriginal<typeof import('i18next')>()
    return { ...actual, default: actual.createInstance() }
  })
  localStorage.clear()
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
})

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
  vi.doUnmock('i18next')
})

test('a new visitor sees Chinese account and channel labels even in an English browser', async () => {
  const { default: i18n } = await import('../config')
  expect(i18n.resolvedLanguage).toBe('zhCN')
  expect(i18n.t('Users')).toBe('用户')
  expect(i18n.t('Channels')).toBe('渠道')
  expect(i18n.t('Root')).toBe('超级管理员')
  expect(i18n.t('Config Name')).toBe('配置名称')
  expect(i18n.t('Strict isolation mode')).toBe('严格隔离模式')
  expect(i18n.t('Always On')).toBe('始终开启')
})

test('a saved language choice is respected and switching back updates channel labels', async () => {
  localStorage.setItem('i18nextLng', 'en')
  const { default: i18n } = await import('../config')
  expect(i18n.t('Config Name')).toBe('Config Name')
  await i18n.changeLanguage('zhCN')
  expect(i18n.t('Config Name')).toBe('配置名称')
  expect(localStorage.getItem('i18nextLng')).toBe('zhCN')
  await i18n.changeLanguage('zhTW')
  expect(i18n.t('Strict isolation mode')).toBe('嚴格隔離模式')
})
