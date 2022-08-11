import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { testSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { createMock } from 'ts-auto-mock'
import { fireWorker } from './fire'

test('fire analytics event worker', () => {
  const AFTER_EVENT_SELECTED = 'AFTER_EVENT_SELECTED'
  const action = analyticsEventModel.fire(1)
  const eventSelector = analyticsEventModel.getSelectorById(action.payload)
  const event = createMock<AnalyticsEvent>()
  const undefinedEvent = undefined

  testSaga(fireWorker, action)
    .next()
    .call(analyticsEventModel.getSelectorById, action.payload)
    .next(eventSelector)
    .select(eventSelector)
    .save(AFTER_EVENT_SELECTED)
    .next(event)
    .put(analyticsEventChannel.play(event))
    .next()
    .isDone()
    .restore(AFTER_EVENT_SELECTED)
    .next(undefinedEvent)
    .isDone()
})
