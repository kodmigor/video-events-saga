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
  const prevTimestampInMs = React.useRef(0)
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

  function checkForEvents (currentTimestampInMs: number) {
    // console.log('currentTimestampInMs ', currentTimestampInMs)
    const skippedTimestamps = range(prevTimestampInMs.current, currentTimestampInMs)
    prevTimestampInMs.current = currentTimestampInMs
    for (let i = 0; i < skippedTimestamps.length; i++) {
      // console.log('----skippedTimestamps[i] ', skippedTimestamps[i])
      const eventIds = timestampIdsRefs.current[skippedTimestamps[i]]
      if (eventIds?.length) {
        for (let y = 0; y < eventIds.length; y++) {
          dispatch(analyticsEventModel.fire(eventIds[y]))
        }
      }
    }
  }

  function handlePlayerReady (player: VideoJsPlayer) {
    playerRef.current = player
    let intervalId: number

    function startTracking () {
      checkForEvents(getCeiledCurrentTimeInMs(player))
    }

    player.on('play', () => {
      prevTimestampInMs.current = getCeiledCurrentTimeInMs(player)
      dispatch(videoPlayerModel.play())
      videojs.log('play')
      intervalId = player.setInterval(startTracking, MINIMUM_INTERVAL)
    })
    player.on('timeupdate', () => {
      videojs.log('player seeking')
      // checkForEvents(getCeiledCurrentTimeInMs(player))
    })
    player.on('seeking', () => {
      videojs.log('player seeking')
    })
    player.on('seeked', () => {
      videojs.log('player seeked')
    })

    player.on('pause', () => {
      dispatch(videoPlayerModel.pause(getCeiledCurrentTimeInMs(player)))
      videojs.log('pause')
      if (intervalId) player.clearInterval(intervalId)
    })

    // player.on('dispose', () => {
    //     videojs.log('player will dispose');
    // });
  }

  return (
        <div className="MainPage">
            <AnalyticsEventsOverlay />
            <VideoPlayerView options={playerOptions} onReady={handlePlayerReady} />
        </div>
  )
}
