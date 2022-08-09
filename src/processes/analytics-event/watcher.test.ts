import { analyticsEventApi } from 'entities/analytics-event'
import { testSaga } from 'redux-saga-test-plan'
import { analyticsEventsWatcher } from './watcher'
import { getAllWorker } from './workers'

import { createMock } from 'ts-auto-mock'

test('analytics events watcher', () => {
  testSaga(analyticsEventsWatcher)
    .next()
    .takeEvery(analyticsEventApi.getAll.type, getAllWorker)
    .next()
    .isDone()
})
