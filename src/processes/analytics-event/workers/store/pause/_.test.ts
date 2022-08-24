import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { expectSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerChannel } from 'shared/packages'
import { createMock } from 'ts-auto-mock'
import { pauseWorker } from './pause'

describe('pause analytics event worker', () => {
  const event = createMock<AnalyticsEvent>()
  const channel = analyticsEventChannel.pause(event, 1)
  const updatedEvent = AnalyticsEvent.reduceDuration(channel.payload.event, channel.payload.pausedAt)

  test('if playing', () => {
    const playerPlayChannel = videoPlayerChannel.play()

    return expectSaga(pauseWorker, channel)
      .call(AnalyticsEvent.reduceDuration, channel.payload.event, channel.payload.pausedAt)
      .provide({ race: () => ({ playing: playerPlayChannel }) })
      .put(analyticsEventChannel.play(updatedEvent))
      .run()
  })

  test('if not actual', () => {
    return expectSaga(pauseWorker, channel)
      .call(AnalyticsEvent.reduceDuration, channel.payload.event, channel.payload.pausedAt)
      .provide({ race: () => ({ notActual: true }) })
      .put(analyticsEventModel.drop(event.id))
      .run()
  })
})
