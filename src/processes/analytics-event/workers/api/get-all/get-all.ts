import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import { AnalyticsEvent } from 'shared/models'
import { call, put } from 'typed-redux-saga'

export function * getAllWorker (action: analyticsEventApi.getAll) {
  yield * put(analyticsEventModel.loading())
  const events = yield * call(action.payload.request)
  const refs = yield * call(AnalyticsEvent.makeTimestampIdsRefs, events)
  yield * put(analyticsEventModel.setAll(events))
  yield * put(analyticsEventModel.setTimestampIdsRefs(refs))
  yield * put(analyticsEventModel.loading(false))
}
