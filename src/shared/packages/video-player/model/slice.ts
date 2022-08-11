import { createAction, createReducer } from '@reduxjs/toolkit'
import { milliseconds } from 'shared/lib'

enum VideoPlayerActionType {
    PAUSE = 'Video player :: pause',
    PLAY = 'Video player :: play',
}

const pause = createAction(VideoPlayerActionType.PAUSE, (payload: milliseconds) => ({ payload }))
type pause = ReturnType<typeof pause>
const play = createAction(VideoPlayerActionType.PLAY)
type play = ReturnType<typeof play>

type VideoPlayerStoreState = {
  pausedAt:milliseconds | null
}

const initialVideoPlayerStoreState: VideoPlayerStoreState = {
  pausedAt: null
}

const reducer = createReducer(initialVideoPlayerStoreState, (builder) => {
  builder
    .addCase(pause, (state, action) => { state.pausedAt = action.payload })
    .addCase(play, (state) => { state.pausedAt = null })
})

function selectPausedAt (state: RootState) {
  return state.entities.analyticsEvent.timestampIdsRefs
}

export {
  pause,
  play,
  reducer,
  selectPausedAt
}
