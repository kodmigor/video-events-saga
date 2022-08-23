import { analyticsEventModel } from 'entities/analytics-event'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerChannel } from 'shared/packages'
import { call, select, take } from 'typed-redux-saga'

export function * checkIfNotActualWorker (eventId: number) {
  const eventSelector = yield * call(analyticsEventModel.getSelectorById, eventId)
  const event = yield * select(eventSelector)
  if (!event) return
  while (true) {
    const updateTimestampChannel = yield * take(videoPlayerChannel.updateTimestamp)
    const isActual = yield * call(AnalyticsEvent.isActual, event, updateTimestampChannel.payload)
    if (!isActual) return
  }
}
