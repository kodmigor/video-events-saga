import './main.scss'

import React from 'react'
import { RefOrNull } from 'shared/lib'
import { VideoJSView } from 'shared/packages'
import videojs, { VideoJsPlayer } from 'video.js'
import { useDispatch } from 'react-redux'
import { analyticsEventApi } from 'entities/analytics-event'

export function MainPageView () {
  const dispatch = useDispatch()
  const playerRef = React.useRef<RefOrNull<VideoJsPlayer>>(null)

  React.useEffect(() => {
    dispatch(analyticsEventApi.getAll())
  }, [])

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

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player
    let reqId: number
    // You can handle player events here, for example:
    const startTracking = function () {
      // console.log(player.currentTime() * 1000);
      reqId = requestAnimationFrame(function play () {
        console.log(player.currentTime())
        reqId = requestAnimationFrame(play)
      })
    }

    const stopTracking = function () {
      if (reqId) {
        cancelAnimationFrame(reqId)
      }
    }
    player.on('play', startTracking)
    player.on('pause', stopTracking)
    // player.on('play', () => {
    //     videojs.log('player is playing');
    //     reqId = player.setInterval(function () {
    //         // videojs.log(player.currentTime());
    //         // queueMicrotask()
    //         videojs.log(Math.round(player.currentTime() * 1000));
    //     }, 5)
    // });

    // player.on('pause', () => {
    //     videojs.log('player is paused');
    //     if (reqId) {
    //         player.clearInterval(reqId);
    //     }
    // });

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
