import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerChannel } from 'shared/packages'
import { call, put, race, take } from 'typed-redux-saga'
import { checkIfNotActualWorker } from '../check-if-actual'

export function * pauseWorker (channel: analyticsEventChannel.pause) {
  const eventWithReducedDuration = yield * call(AnalyticsEvent.reduceDuration, channel.payload.event, channel.payload.pausedAt)
  const { playing } = yield * race({
    playing: take<videoPlayerChannel.play>(videoPlayerChannel.play.type),
    notActual: checkIfNotActualWorker(channel.payload.event.id)
  })

  if (playing) yield * put(analyticsEventChannel.play(eventWithReducedDuration))
  else yield * put(analyticsEventModel.drop(eventWithReducedDuration.id))
}
