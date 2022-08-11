import { analyticsEventChannel, analyticsEventModel } from 'entities/analytics-event'
import { expectSaga } from 'redux-saga-test-plan'
import { AnalyticsEvent } from 'shared/models'
import { videoPlayerModel } from 'shared/packages'
import { createMock } from 'ts-auto-mock'
import { playWorker } from './play'

describe('play analytics event worker', () => {
  const event = createMock<AnalyticsEvent>()
  const channel = analyticsEventChannel.play(event)

  test('if paused', () => {
    const playerPausedAction = videoPlayerModel.pause(1)

    return expectSaga(playWorker, channel)
      .provide({ race: () => ({ paused: playerPausedAction }) })
      .put(analyticsEventChannel.pause(event, playerPausedAction.payload))
      .run()
  })

  test('if timeout', () => {
    return expectSaga(playWorker, channel)
      .provide({ race: () => ({ paused: undefined }) })
      .put(analyticsEventModel.drop(event.id))
      .run()
  })
})
