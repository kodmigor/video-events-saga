import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import { createMock } from 'ts-auto-mock'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { AnalyticsEvent, AnalyticsEventStoreState } from 'shared/models'
import { getAllWorker } from './get-all'
import { EntityState } from '@reduxjs/toolkit'

const action = analyticsEventApi.getAll()

describe('get all analytics events request worker', () => {
  test('keeps correct algorithm', () => {
    const events: AnalyticsEvent[] = []
    const refs = AnalyticsEvent.makeTimestampIdsRefs(events)

    testSaga(getAllWorker, action)
      .next()
      .put(analyticsEventModel.loading())
      .next()
      .call(action.payload.request)
      .next(events)
      .call(AnalyticsEvent.makeTimestampIdsRefs, events)
      .next(refs)
      .put(analyticsEventModel.setAll(events))
      .next()
      .put(analyticsEventModel.setTimestampIdsRefs(refs))
      .next()
      .put(analyticsEventModel.loading(false))
      .next()
      .isDone()
  })

  test('properly changes store', () => {
    const event = createMock<AnalyticsEvent>()
    const events = [event]
    const refs = AnalyticsEvent.makeTimestampIdsRefs(events)
    const finalState = createMock<AnalyticsEventStoreState & EntityState<AnalyticsEvent>>({
      entities: { [event.id]: { ...event } },
      ids: [event.id],
      timestampIdsRefs: refs
    })

    return expectSaga(getAllWorker, action)
      .provide([
        [matchers.call.fn(action.payload.request), events]
      ])
      .withReducer(analyticsEventModel.reducer)
      .hasFinalState(finalState)
      .run()
  })
})
