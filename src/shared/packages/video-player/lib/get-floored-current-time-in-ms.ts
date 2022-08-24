import { milliseconds, MILLISECONDS_PER_SECOND } from 'shared/lib'
import { VideoJsPlayer } from 'video.js'

export function getFlooredCurrentTimeInMs (player: VideoJsPlayer):milliseconds {
  return Math.floor(player.currentTime() * MILLISECONDS_PER_SECOND)
}
