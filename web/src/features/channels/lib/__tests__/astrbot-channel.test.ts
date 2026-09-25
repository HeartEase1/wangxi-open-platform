import { describe, expect, test } from 'vitest'

import { CHANNEL_TYPE_ASTRBOT, CHANNEL_TYPE_SUB2API } from '../../constants'
import { channelSchema } from '../../types'
import {
  CHANNEL_FORM_DEFAULT_VALUES,
  channelFormSchema,
  transformChannelToFormDefaults,
  transformFormDataToCreatePayload,
  transformFormDataToUpdatePayload,
} from '../channel-form'

describe('AstrBot channel migration', () => {
  const form = {
    ...CHANNEL_FORM_DEFAULT_VALUES,
    type: CHANNEL_TYPE_ASTRBOT,
    name: 'StarTrace role',
    base_url: 'https://astrbot.example.com',
    key: 'test-key',
    models: 'StarTrace-Zhongli-v1',
    astrbot_config_id: 'role-1',
    astrbot_context_mode: 'startrace' as const,
    astrbot_require_conversation_id: true,
    astrbot_reuse_caller_conversation_id: true,
    strip_caller_prompts_enabled: true,
  }

  test('round trips role configuration and isolation through create/edit payloads', () => {
    const validated = channelFormSchema.parse(form)
    const created = transformFormDataToCreatePayload(validated).channel
    const saved = channelSchema.parse({
      ...created,
      id: 10,
      created_time: 0,
      test_time: 0,
      response_time: 0,
      balance_updated_time: 0,
      other: '',
      remark: '',
    })
    const defaults = transformChannelToFormDefaults(saved)
    const updated = transformFormDataToUpdatePayload(defaults, 10)
    expect(updated.type).toBe(CHANNEL_TYPE_ASTRBOT)
    expect(JSON.parse(updated.settings ?? '{}')).toMatchObject({
      astrbot_config_id: 'role-1',
      astrbot_context_mode: 'startrace',
      astrbot_require_conversation_id: true,
      astrbot_reuse_caller_conversation_id: true,
      strip_caller_prompts_enabled: true,
    })
  })

  test('requires an AstrBot configuration but does not apply that rule to Sub2API', () => {
    expect(
      channelFormSchema.safeParse({ ...form, astrbot_config_id: '' }).success
    ).toBe(false)
    expect(
      channelFormSchema.safeParse({
        ...form,
        type: CHANNEL_TYPE_SUB2API,
        astrbot_config_id: '',
      }).success
    ).toBe(true)
  })

  test('switching to Sub2API removes role-specific settings', () => {
    const created = transformFormDataToCreatePayload(form).channel
    const updated = transformFormDataToUpdatePayload(
      {
        ...form,
        type: CHANNEL_TYPE_SUB2API,
        settings: created.settings ?? '{}',
      },
      10
    )
    const settings = JSON.parse(updated.settings ?? '{}')
    expect(settings).not.toHaveProperty('astrbot_config_id')
    expect(settings).not.toHaveProperty('astrbot_context_mode')
    expect(settings).not.toHaveProperty('strip_caller_prompts_enabled')
  })
})
