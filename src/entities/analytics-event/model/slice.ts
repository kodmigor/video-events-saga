import { createAction, createEntityAdapter, createReducer } from '@reduxjs/toolkit'
import { AnalyticsEvent } from 'shared/models'

enum AnalyticsEventActionType {
    SET_ALL = 'Analytics event :: set all',
}

const setAll = createAction(AnalyticsEventActionType.SET_ALL, (payload: AnalyticsEvent[]) => ({ payload }))

const analyticsEventAdapter = createEntityAdapter<AnalyticsEvent>()

const reducer = createReducer(analyticsEventAdapter.getInitialState(), (builder) => {
  builder
    .addCase(setAll, analyticsEventAdapter.setAll)
})

const {
  selectById: byId,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = analyticsEventAdapter.getSelectors((state: RootState) => state.entities.analyticsEvent)

function selectById (eventId: number) {
  return function (state: any) {
    return byId(state, eventId)
  }
}

export {
  setAll,
  reducer,
  selectById,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
}
