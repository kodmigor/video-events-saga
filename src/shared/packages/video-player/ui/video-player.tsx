import React from 'react'
import { RefOrNull } from 'shared/lib'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { AnalyticsEventsOverlayView } from 'widgets/analytics-events-overlay'

interface VideoPlayerView {
  Overlay?: React.FunctionComponent
  options: VideoJsPlayerOptions
  onReady(player: VideoJsPlayer): void
}

export function VideoPlayerView ({ Overlay, options, onReady }: VideoPlayerView) {
  const videoRef = React.useRef(null)
  const playerRef = React.useRef<RefOrNull<VideoJsPlayer>>(null)

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) return

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready')
        onReady && onReady(player)
      })
      player.aspectRatio('16:9')

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      // const player = playerRef.current;

      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player>
      {Overlay && <Overlay />}
      <video ref={videoRef} className='video-js vjs-big-play-centered' />
    </div>
  )
}
