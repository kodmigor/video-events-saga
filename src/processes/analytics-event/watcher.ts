import { analyticsEventApi } from 'entities/analytics-event'
import { takeEvery } from 'typed-redux-saga'
import { getAllWorker } from './workers'

export function * analyticsEventsWatcher () {
  yield * takeEvery(analyticsEventApi.getAll.type, getAllWorker)
}
