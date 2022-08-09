import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import { testSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { getAllWorker } from '../get-all'

const action = analyticsEventApi.getAll()

it('get all analytics events request worker', () => {
  const events: AnalyticsEvent[] = []

  testSaga(getAllWorker, action)
    .next()
    .call(action.payload.request)
    .next(events)
    .put(analyticsEventModel.setAll(events))
    .next()
    .isDone()
})
