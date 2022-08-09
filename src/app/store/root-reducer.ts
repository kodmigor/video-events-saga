import { combineReducers } from '@reduxjs/toolkit'
import { entitiesReducer } from 'entities/reducer'

export const rootReducer = combineReducers({
  entities: entitiesReducer
})
