import './video-analytics.scss'

import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import range from 'lodash.range'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bemBlock, milliseconds, MILLISECONDS_PER_SECOND, MINIMUM_INTERVAL, RefOrNull, seconds } from 'shared/lib'
import { TimestampIdsRefs } from 'shared/models'
import { getFlooredCurrentTimeInMs, videoPlayerChannel, VideoPlayerView } from 'shared/packages'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { AnalyticsEventsListView } from 'widgets/analytics-events-list'
import { AnalyticsEventsOverlayView } from 'widgets/analytics-events-overlay'

export function VideoAnalyticsPageView () {
  const videoAnalyticsBlock = bemBlock('VideoAnalytics')
  const dispatch = useDispatch()
  const playerRef = React.useRef<RefOrNull<VideoJsPlayer>>(null)
  const _timestampIdsRefs = useSelector(analyticsEventModel.selectTimestampIdsRefs)
  const timestampIdsRefs = React.useRef<TimestampIdsRefs>({})

  // TODO: ожидать загрузки событий
  React.useEffect(() => {
    dispatch(analyticsEventApi.getAll())
  }, [])

  React.useEffect(() => {
    timestampIdsRefs.current = _timestampIdsRefs
  }, [_timestampIdsRefs])

  const playerOptions: VideoJsPlayerOptions = {
    autoplay: false,
    controls: true,
    controlBar: {
      fullscreenToggle: false,
      pictureInPictureToggle: false
    },
    userActions: {
      doubleClick: false
    },
    responsive: true,
    fluid: true,
    sources: [{
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    }]
  }
  let prevTimestampInMs = 0

  function onPlayerReady (player: VideoJsPlayer) {
    playerRef.current = player
    let intervalId: number
    let currentTimestampInMs = 0

    // Вариант 1
    function seekForEvents () {
      if (prevTimestampInMs === currentTimestampInMs) return
      const skippedTimestamps = range(prevTimestampInMs, currentTimestampInMs)
      console.log({ skippedTimestamps })
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

    // function seekForEvents () {
    //   const currentTimestampInMs = getCeiledCurrentTimeInMs(player)
    //   const MAX_SKIPPED_TIMESTAMPS = 20
    //   if (prevTimestampInMs === currentTimestampInMs) return

    //   const skippedTimestamps = range(prevTimestampInMs, currentTimestampInMs)
    //   if (skippedTimestamps.length > MAX_SKIPPED_TIMESTAMPS) return

    //   prevTimestampInMs = currentTimestampInMs
    //   for (let i = 0; i < skippedTimestamps.length; i++) {
    //     const eventIds = timestampIdsRefs.current[skippedTimestamps[i]]
    //     if (eventIds?.length) {
    //       for (let y = 0; y < eventIds.length; y++) {
    //         dispatch(analyticsEventModel.fire(eventIds[y]))
    //       }
    //     }
    //   }
    // }

    function clearSeekForEventsInterval () {
      if (intervalId) player.clearInterval(intervalId)
    }

    function onPlaying () {
      videojs.log('onPlaying')
      // clearSeekForEventsInterval()
      dispatch(videoPlayerChannel.play())

      intervalId = player.setInterval(seekForEvents, MINIMUM_INTERVAL)
    }

    function onPause () {
      videojs.log('onPause')

      dispatch(videoPlayerChannel.pause(getFlooredCurrentTimeInMs(player)))
      clearSeekForEventsInterval()
    }

    function onTimeUpdate () {
      videojs.log('onTimeUpdate')

      currentTimestampInMs = getFlooredCurrentTimeInMs(player)
    }

    function onSeeked () {
      videojs.log('onSeeked')
      currentTimestampInMs = getFlooredCurrentTimeInMs(player)
      prevTimestampInMs = currentTimestampInMs
      dispatch(videoPlayerChannel.updateTimestamp(currentTimestampInMs))
    }

    player.on('playing', onPlaying)
    player.on('seeked', onSeeked)
    player.on('pause', onPause)
    player.on('timeupdate', onTimeUpdate)
  }

  function goToEvent (timestamp: milliseconds) {
    playerRef.current?.currentTime(timestamp / MILLISECONDS_PER_SECOND)
    prevTimestampInMs = timestamp
  }

  return (
    <div className={videoAnalyticsBlock()}>
      <AnalyticsEventsListView
        className={videoAnalyticsBlock('eventsList')}
        goToEvent={goToEvent}
      />
      <div className={videoAnalyticsBlock('player')}>
        <VideoPlayerView Overlay={AnalyticsEventsOverlayView} options={playerOptions} onReady={onPlayerReady} />
      </div>
    </div>
  )
}
