import { analyticsEventApi, analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { takeEvery } from 'typed-redux-saga'
import { getAllWorker, fireWorker, playWorker, pauseWorker } from '../workers'

export function * analyticsEventsWatcher () {
  yield * takeEvery(analyticsEventApi.getAll.type, getAllWorker)
  yield * takeEvery(analyticsEventModel.fire.type, fireWorker)
  yield * takeEvery(analyticsEventChannel.play.type, playWorker)
  yield * takeEvery(analyticsEventChannel.pause.type, pauseWorker)
}
