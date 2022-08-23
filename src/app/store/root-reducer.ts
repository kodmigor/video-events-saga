import { combineReducers } from '@reduxjs/toolkit'
import { entitiesReducer } from 'entities/reducer'
// import { videoPlayerModel } from 'shared/packages'

export const rootReducer = combineReducers({
  entities: entitiesReducer
  // videoPlayer: videoPlayerModel.reducer
})
