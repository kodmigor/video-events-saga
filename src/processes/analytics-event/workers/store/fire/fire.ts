import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { call, put, select } from 'typed-redux-saga'

export function * fireWorker (action: analyticsEventModel.fire) {
  const eventSelector = yield * call(analyticsEventModel.getSelectorById, action.payload)
  const event = yield * select(eventSelector)
  if (event) yield * put(analyticsEventChannel.play(event))
}
