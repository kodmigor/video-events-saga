import { createAction, createEntityAdapter, createReducer } from '@reduxjs/toolkit'
import { AnalyticsEvent, AnalyticsEventId, AnalyticsEventStoreState, TimestampIdsRefs } from 'shared/models'

const FIRE = 'Analytics event :: fire' as const
const DROP = 'Analytics event :: drop' as const
const LOADING = 'Analytics event :: loading' as const
const SET_ALL = 'Analytics event :: set all' as const
const SET_TIMESTAMP_IDS_REFS = 'Analytics event :: set timestamp -> ids refs' as const

const fire = createAction(FIRE, (payload: AnalyticsEventId) => ({ payload }))
type fire = ReturnType<typeof fire>
const drop = createAction(DROP, (payload: AnalyticsEventId) => ({ payload }))
type drop = ReturnType<typeof drop>
const loading = createAction(LOADING, (payload: boolean = true) => ({ payload }))
type loading = ReturnType<typeof drop>
const setAll = createAction(SET_ALL, (payload: AnalyticsEvent[]) => ({ payload }))
type setAll = ReturnType<typeof setAll>
const setTimestampIdsRefs = createAction(SET_TIMESTAMP_IDS_REFS, (payload: TimestampIdsRefs) => ({ payload }))
type setTimestampIdsRefs = ReturnType<typeof setTimestampIdsRefs>

const analyticsEventAdapter = createEntityAdapter<AnalyticsEvent>({
  sortComparer: (eventA, eventB) => eventA.timestamp - eventB.timestamp
})

const reducer = createReducer(
  analyticsEventAdapter.getInitialState<AnalyticsEventStoreState>({
    firedIds: [],
    loading: false,
    timestampIdsRefs: {}
  }),
  (builder) => {
    builder
      .addCase(fire, (state, action) => { state.firedIds = [...new Set(state.firedIds.concat(action.payload))] })
      .addCase(drop, (state, action) => { state.firedIds = state.firedIds.filter((id) => id !== action.payload) })
      .addCase(loading, (state, action) => { state.loading = action.payload })
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

function selectLoading (state: AppState) {
  return state.entities.analyticsEvent.loading
}

function selectTimestampIdsRefs (state: AppState) {
  return state.entities.analyticsEvent.timestampIdsRefs
}

export {
  fire,
  drop,
  loading,
  setAll,
  setTimestampIdsRefs,
  reducer,
  getSelectorById,
  selectAll,
  selectEntities,
  selectFiredIds,
  selectLoading,
  selectTimestampIdsRefs,
  selectIds,
  selectTotal
}
