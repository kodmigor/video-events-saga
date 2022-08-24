import { all } from 'typed-redux-saga'
import { analyticsEventsWatcher } from './analytics-event/watcher'

export function * rootSaga () {
  yield * all([
    analyticsEventsWatcher()
  ])
}
