import { analyticsEventChannel } from 'entities/analytics-event'
import { testSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerModel } from 'shared/packages'
import { createMock } from 'ts-auto-mock'
import { pauseWorker } from './pause'

test('pause analytics event worker', () => {
  const event = createMock<AnalyticsEvent>()
  const channel = analyticsEventChannel.pause(event, 1)

  testSaga(pauseWorker, channel)
    .next()
    .call(AnalyticsEvent.updateDuration, channel.payload.event, channel.payload.pausedAt)
    .next(event)
    .take(videoPlayerModel.play.type)
    .next()
    .put(analyticsEventChannel.play(event))
    .next()
    .isDone()
})
