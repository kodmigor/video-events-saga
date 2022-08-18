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
      if (prevTimestampInMs === currentTimestampInMs) return
      console.log({ prevTimestampInMs })
      console.log({ currentTimestampInMs })
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

    player.on('playing', () => {
      prevTimestampInMs = getCeiledCurrentTimeInMs(player)
      dispatch(videoPlayerModel.play())
      videojs.log('playing')

      intervalId = player.setInterval(seekForEvents, MINIMUM_INTERVAL)
    })

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
