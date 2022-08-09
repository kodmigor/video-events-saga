import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import { call, put } from 'typed-redux-saga'

export function * getAllWorker (action: analyticsEventApi.getAll) {
  const events = yield * call(action.payload.request)
  yield * put(analyticsEventModel.setAll(events))
}
