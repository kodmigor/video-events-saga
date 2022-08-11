import { analyticsEventApi, analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { testSaga } from 'redux-saga-test-plan'
import { analyticsEventsWatcher } from './watcher'

import { getAllWorker } from '../workers/api'
import { fireWorker, pauseWorker, playWorker } from '../workers'

test('analytics events watcher', () => {
  testSaga(analyticsEventsWatcher)
    .next()
    .takeEvery(analyticsEventApi.getAll.type, getAllWorker)
    .next()
    .takeEvery(analyticsEventModel.fire.type, fireWorker)
    .next()
    .takeEvery(analyticsEventChannel.play.type, playWorker)
    .next()
    .takeEvery(analyticsEventChannel.pause.type, pauseWorker)
    .next()
    .isDone()
})
