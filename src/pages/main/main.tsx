import './main.scss'

import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import range from 'lodash.range'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MINIMUM_INTERVAL, RefOrNull } from 'shared/lib'
import { TimestampIdsRefs } from 'shared/models'
import { getCeiledCurrentTimeInMs, videoPlayerModel, VideoPlayerView } from 'shared/packages'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { AnalyticsEventsOverlay } from 'widgets/analytics-events-overlay'

export function MainPageView () {
  const dispatch = useDispatch()
  const playerRef = React.useRef<RefOrNull<VideoJsPlayer>>(null)
  const _timestampIdsRefs = useSelector(analyticsEventModel.selectTimestampIdsRefs)
  const timestampIdsRefs = React.useRef<TimestampIdsRefs>({})

  React.useEffect(() => {
    dispatch(analyticsEventApi.getAll())
  }, [])

  React.useEffect(() => {
    timestampIdsRefs.current = _timestampIdsRefs
  }, [_timestampIdsRefs])

  const playerOptions:VideoJsPlayerOptions = {
    autoplay: false,
    controls: true,
    controlBar: {
      fullscreenToggle: false,
      pictureInPictureToggle: false
    },
    responsive: true,
    fluid: true,
    sources: [{
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    }]
  }

  function handlePlayerReady (player: VideoJsPlayer) {
    playerRef.current = player
    let intervalId: number
    let prevTimestampInMs = 0
    let currentTimestampInMs = 0

    function seekForEvents () {
      // Вариант 2

      // Замыкание переменной `currentTimestampInMs` позволит значительно увеличить частоту поиска актуальных событий.
      // Переменная `MAX_SKIPPED_TIMESTAMPS` ограничивает количество временных меток для поиска,
      // что позволяет избегать ситуаций, когда:

      // (*)
      // при перемотке видео значение переменной `prevTimestampInMs` не успевает обновиться
      // до обновления значения переменной `currentTimestampInMs`, и массив меток `skippedTimestamps`
      // содержит все метки, пропущенные при перемотке, тем самым отображая все, якобы актуальные, события.

      // Однако такой варинат также значительно увеличивает частоту постановки функции `seekForEvents` в очередь событий js,
      // что может повлиять на корректность работы.
      // (пример: очередной вызов функции `onPlaying` после перемотки может встать в очередь уже после того, как там оказалась
      // функция `seekForEvents`, вызванная во время работы предыдущего запуска `onPlaying`,
      // создавая тем самым ситуацию, описанную выше (*))

      // Субъективно, визуальной разницы между обоими вариантами нет,
      // поэтому, если в ТЗ нет конкретики по вопросу частоты поиска событий аналитики во время воспроизведения,
      // а также в связи с вышеописанными рисками, полагаю, что варинат 1 более оптимальный.

      // const currentTimestampInMs = getCeiledCurrentTimeInMs(player)
      // const MAX_SKIPPED_TIMESTAMPS = 20
      // if (prevTimestampInMs === currentTimestampInMs) return
      // const skippedTimestamps = range(prevTimestampInMs, currentTimestampInMs)

      // if (skippedTimestamps.length > 20) return

      if (prevTimestampInMs === currentTimestampInMs) return
      const skippedTimestamps = range(prevTimestampInMs, currentTimestampInMs)

      prevTimestampInMs = currentTimestampInMs
      for (let i = 0; i < skippedTimestamps.length; i++) {
        const eventIds = timestampIdsRefs.current[skippedTimestamps[i]]
        if (eventIds?.length) {
          for (let y = 0; y < eventIds.length; y++) {
            dispatch(analyticsEventModel.fire(eventIds[y]))
          }
        }
      }
    }

    player.on('timeupdate', () => {
      console.log('player.paused() ', player.paused())
      currentTimestampInMs = getCeiledCurrentTimeInMs(player)
    })
    function onPlaying () {
      prevTimestampInMs = getCeiledCurrentTimeInMs(player)
      dispatch(videoPlayerModel.play())
      videojs.log('playing')

      intervalId = player.setInterval(seekForEvents, MINIMUM_INTERVAL)
    }

    player.on('playing', onPlaying)

    player.on('pause', () => {
      dispatch(videoPlayerModel.pause(getCeiledCurrentTimeInMs(player)))
      videojs.log('pause')
      if (intervalId) player.clearInterval(intervalId)
    })
  }

  return (
        <div className="MainPage">
            <AnalyticsEventsOverlay />
            <VideoPlayerView options={playerOptions} onReady={handlePlayerReady} />
        </div>
  )
}
