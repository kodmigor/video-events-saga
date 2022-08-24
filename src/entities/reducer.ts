import { combineReducers } from '@reduxjs/toolkit'
import { analyticsEventModel } from './analytics-event'

export const entitiesReducer = combineReducers({
  analyticsEvent: analyticsEventModel.reducer
})
