import { createChannel } from 'shared/lib'
import { AnalyticsEvent } from 'shared/models'

const PLAY = 'analytics event play' as const
const PAUSE = 'analytics event pause' as const

export const play = createChannel(PLAY, (payload: AnalyticsEvent) => ({ payload }))
export type play = ReturnType<typeof play>

export const pause = createChannel(PAUSE, (event: AnalyticsEvent, pausedAt: number) => ({ payload: { event, pausedAt } }))
export type pause = ReturnType<typeof pause>
