import { createChannel, milliseconds } from 'shared/lib'

enum VideoPlayerChannelType {
    PAUSE = 'video player pause',
    PLAY = 'video player play',
    UPDATE_TIMESTAMP = 'video player update timestamp',
}

export const pause = createChannel(VideoPlayerChannelType.PAUSE, (payload: milliseconds) => ({ payload }))
export type pause = ReturnType<typeof pause>
export const play = createChannel(VideoPlayerChannelType.PLAY)
export type play = ReturnType<typeof play>
export const updateTimestamp = createChannel(VideoPlayerChannelType.UPDATE_TIMESTAMP, (payload: milliseconds) => ({ payload }))
export type updateTimestamp = ReturnType<typeof updateTimestamp>
