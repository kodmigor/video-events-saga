import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import { createMock } from 'ts-auto-mock'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { AnalyticsEvent } from 'shared/models'
import { getAllWorker } from './get-all'
import { EntityState } from '@reduxjs/toolkit'

const action = analyticsEventApi.getAll()

test('get all analytics events request worker', () => {
  const events: AnalyticsEvent[] = []

  testSaga(getAllWorker, action)
    .next()
    .call(action.payload.request)
    .next(events)
    .put(analyticsEventModel.setAll(events))
    .next()
    .isDone()
})

test('fetches the user', () => {
  const event = createMock<AnalyticsEvent>()
  const events = [event]
  const finalState = createMock<EntityState<AnalyticsEvent>>({
    entities: { [event.id]: { ...event } },
    ids: [event.id]
  })

  return expectSaga(getAllWorker, action)
    .provide([
      [matchers.call.fn(action.payload.request), events]
    ])
    .withReducer(analyticsEventModel.reducer)
    .hasFinalState(finalState)
    .run()
})
