import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { expectSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerChannel } from 'shared/packages'
import { createMock } from 'ts-auto-mock'
import { playWorker } from './play'

describe('play analytics event worker', () => {
  const event = createMock<AnalyticsEvent>()
  const channel = analyticsEventChannel.play(event)

  test('if paused', () => {
    const playerPausedAction = videoPlayerChannel.pause(1)

    return expectSaga(playWorker, channel)
      .provide({ race: () => ({ paused: playerPausedAction }) })
      .put(analyticsEventChannel.pause(event, playerPausedAction.payload))
      .run()
  })

  test('if timeout', () => {
    return expectSaga(playWorker, channel)
      .provide({ race: () => ({ timeout: true }) })
      .put(analyticsEventModel.drop(event.id))
      .run()
  })

  test('if not actual', () => {
    return expectSaga(playWorker, channel)
      .provide({ race: () => ({ notActual: true }) })
      .put(analyticsEventModel.drop(event.id))
      .run()
  })
})
