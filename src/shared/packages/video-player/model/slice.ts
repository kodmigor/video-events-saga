import { createAction, createReducer } from '@reduxjs/toolkit'

enum VideoPlayerActionType {
    PAUSE = 'Video player :: pause',
    PLAY = 'Video player :: play',
}

type PausedAtInMs = number

const pause = createAction(VideoPlayerActionType.PAUSE, (payload: PausedAtInMs) => ({ payload }))
const play = createAction(VideoPlayerActionType.PLAY)

type VideoPlayerStoreState = {
  pausedAtInMs:PausedAtInMs | null
}

const initialVideoPlayerStoreState: VideoPlayerStoreState = {
  pausedAtInMs: null
}

const reducer = createReducer(initialVideoPlayerStoreState, (builder) => {
  builder
    .addCase(pause, (state, action) => { state.pausedAtInMs = action.payload })
    .addCase(play, (state) => { state.pausedAtInMs = null })
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
