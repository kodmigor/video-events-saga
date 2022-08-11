import { createAction, createEntityAdapter, createReducer } from '@reduxjs/toolkit'
import { AnalyticsEvent, AnalyticsEventStoreState, TimestampIdsRefs } from 'shared/models'

enum AnalyticsEventActionType {
    SET_ALL = 'Analytics event :: set all',
    SET_TIMESTAMP_IDS_REFS = 'Analytics event :: set timestamp -> ids refs',
}

const setAll = createAction(AnalyticsEventActionType.SET_ALL, (payload: AnalyticsEvent[]) => ({ payload }))
const setTimestampIdsRefs = createAction(AnalyticsEventActionType.SET_TIMESTAMP_IDS_REFS, (payload: TimestampIdsRefs) => ({ payload }))

const analyticsEventAdapter = createEntityAdapter<AnalyticsEvent>()

const reducer = createReducer(
  analyticsEventAdapter.getInitialState<AnalyticsEventStoreState>({
    timestampIdsRefs: {}
  }),
  (builder) => {
    builder
      .addCase(setAll, analyticsEventAdapter.setAll)
      .addCase(setTimestampIdsRefs, (state, action) => {
        state.timestampIdsRefs = action.payload
      })
  })

const {
  selectById: byId,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = analyticsEventAdapter.getSelectors((state: RootState) => state.entities.analyticsEvent)

function selectById (eventId: number) {
  return function (state: RootState) {
    return byId(state, eventId)
  }
}

function selectTimestampIdsRefs (state: RootState) {
  return state.entities.analyticsEvent.timestampIdsRefs
}

export {
  setAll,
  setTimestampIdsRefs,
  reducer,
  selectById,
  selectAll,
  selectEntities,
  selectTimestampIdsRefs,
  selectIds,
  selectTotal
}
