import './main.scss'

import React from 'react'
import { MILLISECONDS_PER_SECOND, RefOrNull } from 'shared/lib'
import { VideoJSView } from 'shared/packages'
import videojs, { VideoJsPlayer } from 'video.js'
import { useDispatch, useSelector } from 'react-redux'
import { analyticsEventApi, analyticsEventModel } from 'entities/analytics-event'
import range from 'lodash.range'
import { TimestampIdsRefs } from 'shared/models'

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

  const videoJsOptions = {
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
    const skippedTimestamps = range(prevTimestampInMs.current, currentTimestampInMs)
    prevTimestampInMs.current = currentTimestampInMs
    for (let i = 0; i < skippedTimestamps.length; i++) {
      const eventIds = timestampIdsRefs.current[skippedTimestamps[i]]
      if (eventIds?.length) {
        console.log('--- eventIds: ', eventIds)
      }
    }
  }

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player
    let reqId: number

    const startTracking = function () {
      checkForEvents(Math.ceil(player.currentTime() * MILLISECONDS_PER_SECOND))
    }

    player.on('play', () => {
      videojs.log('player is playing')
      reqId = player.setInterval(startTracking, 0)
    })

    player.on('pause', () => {
      videojs.log('player is paused')
      if (reqId) player.clearInterval(reqId)
    })

    // player.on('dispose', () => {
    //     videojs.log('player will dispose');
    // });
  }

  return (
        <div className="MainPage">
            <VideoJSView options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
  )
}
