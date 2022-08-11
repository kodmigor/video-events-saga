import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { videoPlayerModel } from 'shared/packages'
import { delay, put, race, take } from 'typed-redux-saga'

export function * playWorker (channel: analyticsEventChannel.play) {
  const event = channel.payload
  const { paused } = yield * race({
    paused: take<videoPlayerModel.pause>(videoPlayerModel.pause.type),
    timeout: delay(event.duration)
  })

  if (paused) yield * put(analyticsEventChannel.pause(event, paused.payload))
  else yield * put(analyticsEventModel.drop(event.id))
}
