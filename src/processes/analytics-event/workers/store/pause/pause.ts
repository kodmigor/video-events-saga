import { analyticsEventChannel } from 'entities/analytics-event'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerModel } from 'shared/packages'
import { call, put, take } from 'typed-redux-saga'

export function * pauseWorker (channel: analyticsEventChannel.pause) {
  const event = yield * call(AnalyticsEvent.updateDuration, channel.payload.event, channel.payload.pausedAt)
  yield * take<videoPlayerModel.play>(videoPlayerModel.play.type)
  yield * put(analyticsEventChannel.play(event))
}
