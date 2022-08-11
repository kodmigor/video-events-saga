import { milliseconds, MILLISECONDS_PER_SECOND } from 'shared/lib'
import { VideoJsPlayer } from 'video.js'

export function getCeiledCurrentTimeInMs (player: VideoJsPlayer):milliseconds {
  return Math.ceil(player.currentTime() * MILLISECONDS_PER_SECOND)
}
