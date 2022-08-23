import { createAction, createEntityAdapter, createReducer } from '@reduxjs/toolkit'
import { AnalyticsEvent, AnalyticsEventId, AnalyticsEventStoreState, TimestampIdsRefs } from 'shared/models'

const FIRE = 'Analytics event :: fire' as const
const DROP = 'Analytics event :: drop' as const
const DROP_ALL = 'Analytics event :: drop all' as const
const SET_ALL = 'Analytics event :: set all' as const
const SET_TIMESTAMP_IDS_REFS = 'Analytics event :: set timestamp -> ids refs' as const

const fire = createAction(FIRE, (payload: AnalyticsEventId) => ({ payload }))
type fire = ReturnType<typeof fire>
const drop = createAction(DROP, (payload: AnalyticsEventId) => ({ payload }))
type drop = ReturnType<typeof drop>
const dropAll = createAction(DROP_ALL)
type dropAll = ReturnType<typeof dropAll>
const setAll = createAction(SET_ALL, (payload: AnalyticsEvent[]) => ({ payload }))
type setAll = ReturnType<typeof setAll>
const setTimestampIdsRefs = createAction(SET_TIMESTAMP_IDS_REFS, (payload: TimestampIdsRefs) => ({ payload }))
type setTimestampIdsRefs = ReturnType<typeof setTimestampIdsRefs>

const analyticsEventAdapter = createEntityAdapter<AnalyticsEvent>()

const reducer = createReducer(
  analyticsEventAdapter.getInitialState<AnalyticsEventStoreState>({
    firedIds: [],
    timestampIdsRefs: {}
  }),
  (builder) => {
    builder
      .addCase(fire, (state, action) => { state.firedIds = state.firedIds.concat(action.payload) })
      .addCase(drop, (state, action) => { state.firedIds = state.firedIds.filter((id) => id !== action.payload) })
      .addCase(dropAll, (state) => { state.firedIds = [] })
      .addCase(setAll, analyticsEventAdapter.setAll)
      .addCase(setTimestampIdsRefs, (state, action) => { state.timestampIdsRefs = action.payload })
  })

const {
  selectById: byId,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = analyticsEventAdapter.getSelectors((state: AppState) => state.entities.analyticsEvent)

function getSelectorById (eventId: number) {
  return function selectById (state: AppState) {
    return byId(state, eventId)
  }
}

function selectFiredIds (state: AppState) {
  return state.entities.analyticsEvent.firedIds
}

function selectTimestampIdsRefs (state: AppState) {
  return state.entities.analyticsEvent.timestampIdsRefs
}

export {
  fire,
  drop,
  setAll,
  setTimestampIdsRefs,
  reducer,
  getSelectorById,
  selectAll,
  selectEntities,
  selectFiredIds,
  selectTimestampIdsRefs,
  selectIds,
  selectTotal
}
