import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { videoPlayerChannel } from 'shared/packages'
import { delay, put, race, take } from 'typed-redux-saga'
import { checkIfNotActualWorker } from '../check-if-actual'

export function * playWorker (channel: analyticsEventChannel.play) {
  const event = channel.payload
  const { paused } = yield * race({
    paused: take<videoPlayerChannel.pause>(videoPlayerChannel.pause.type),
    timeout: delay(event.duration),
    notActual: checkIfNotActualWorker(channel.payload.id)
  })

  if (paused) yield * put(analyticsEventChannel.pause(event, paused.payload))
  else yield * put(analyticsEventModel.drop(event.id))
}
