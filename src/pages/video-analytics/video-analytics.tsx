import './video-analytics.scss'

import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import range from 'lodash.range'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bemBlock, milliseconds, MILLISECONDS_PER_SECOND, MINIMUM_INTERVAL, RefOrNull, seconds } from 'shared/lib'
import { TimestampIdsRefs } from 'shared/models'
import { getFlooredCurrentTimeInMs, videoPlayerChannel, VideoPlayerView } from 'shared/packages'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { AnalyticsEventsListView } from 'widgets/analytics-events-list'
import { AnalyticsEventsOverlayView } from 'widgets/analytics-events-overlay'

export function VideoAnalyticsPageView () {
  const videoAnalyticsBlock = bemBlock('VideoAnalytics')
  const dispatch = useDispatch()
  const playerRef = React.useRef<RefOrNull<VideoJsPlayer>>(null)
  const loading = useSelector(analyticsEventModel.selectLoading)
  const _timestampIdsRefs = useSelector(analyticsEventModel.selectTimestampIdsRefs)
  const timestampIdsRefs = React.useRef<TimestampIdsRefs>({})

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

  const prevTimestampInMs = React.useRef(0)
  const intervalId = React.useRef<RefOrNull<number>>(null)
  const currentTimestampInMs = React.useRef(0)

  function clearSeekForEventsInterval () {
    if (intervalId.current) playerRef.current!.clearInterval(intervalId.current)
  }

  function onPlayerReady (player: VideoJsPlayer) {
    playerRef.current = player

    // Вариант 1
    function seekForEvents () {
      if (prevTimestampInMs.current === currentTimestampInMs.current) return
      const skippedTimestamps = range(prevTimestampInMs.current, currentTimestampInMs.current)
      prevTimestampInMs.current = currentTimestampInMs.current
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

    // Пример обнаруженной уязвимости: очередной вызов функции `onPlaying` после перемотки может встать в очередь уже после того,
    // как там оказалась функция `seekForEvents`, вызванная во время работы предыдущего запуска `onPlaying`,
    // создавая тем самым ситуацию, описанную выше (*)

    // Субъективно, особой визуальной разницы между обоими вариантами нет (при использовании второго варианта отображение
    // события при переходе к временной метке из списка происходит немного быстрее),
    // поэтому, если в ТЗ нет конкретики по вопросу частоты поиска событий аналитики во время воспроизведения,
    // а также в связи с вышеописанными рисками, полагаю, что варинат 1 более оптимальный.

    // function seekForEvents () {
    //   const currentTimestampInMs = getFlooredCurrentTimeInMs(player)
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

    function onPlaying () {
      dispatch(videoPlayerChannel.play())
      clearSeekForEventsInterval()
      intervalId.current = player.setInterval(seekForEvents, MINIMUM_INTERVAL)
    }

    function onPause () {
      dispatch(videoPlayerChannel.pause(getFlooredCurrentTimeInMs(player)))
      clearSeekForEventsInterval()
    }

    function onTimeUpdate () {
      currentTimestampInMs.current = getFlooredCurrentTimeInMs(player)
    }

    function onSeeked () {
      clearSeekForEventsInterval()
      prevTimestampInMs.current = currentTimestampInMs.current
      dispatch(videoPlayerChannel.updateTimestamp(currentTimestampInMs.current))
    }

    player.on('playing', onPlaying)
    player.on('timeupdate', onTimeUpdate)
    player.on('pause', onPause)
    player.on('seeked', onSeeked)
  }

  function goToEvent (timestamp: milliseconds) {
    clearSeekForEventsInterval()
    playerRef.current?.currentTime(timestamp / MILLISECONDS_PER_SECOND)
    prevTimestampInMs.current = timestamp
  }

  return (
    <div className={videoAnalyticsBlock()}>
      {loading && <div className={videoAnalyticsBlock('loading')}>Загрузка...</div>}
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
