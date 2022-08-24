import { analyticsEventModel } from 'entities/analytics-event'
import { testSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerChannel } from 'shared/packages'
import { createMock } from 'ts-auto-mock'
import { checkIfNotActualWorker } from './check-if-not-actual'

test('check if analytics event not actual worker', () => {
  const event = createMock<AnalyticsEvent>({ duration: 3, timestamp: 1 })
  const eventSelector = analyticsEventModel.getSelectorById(event.id)
  const timestampInRange = 2
  const timestampOutOfRange = 5

  testSaga(checkIfNotActualWorker, event.id)
    .next()
    .call(analyticsEventModel.getSelectorById, event.id)
    .next(eventSelector)
    .select(eventSelector)
    .next(event)
    .take(videoPlayerChannel.updateTimestamp)
    .next(videoPlayerChannel.updateTimestamp(timestampInRange))
    .call(AnalyticsEvent.isActual, event, timestampInRange)
    .next(true)
    .take(videoPlayerChannel.updateTimestamp)
    .next(videoPlayerChannel.updateTimestamp(timestampOutOfRange))
    .call(AnalyticsEvent.isActual, event, timestampOutOfRange)
    .next(false)
    .isDone()
})
