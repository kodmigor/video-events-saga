import { normalize, schema } from 'normalizr'
import { retry } from 'typed-redux-saga'
import { milliseconds } from 'shared/lib'

export type AnalyticsEvent = {
  id: number
  timestamp: milliseconds
  duration: milliseconds
  zone: {
      left: number
      top: number
      width: number
      height: number
  }
}

const TIMESTAMP_IDS_REFS_NAME = 'timestampIdsRefs' as const

export type AnalyticsEventId = number
type AnalyticsEventIds = Array<AnalyticsEventId>

export type TimestampIdsRefs = Record<number, AnalyticsEventIds>
export type AnalyticsEventStoreState = {
  firedIds: AnalyticsEventId[]
  loading: boolean
  timestampIdsRefs: TimestampIdsRefs
}
type TimestampIdsRefsEntities = {
    [TIMESTAMP_IDS_REFS_NAME]: TimestampIdsRefs
  }

const timestampIdsRefValueShema = new schema.Entity<AnalyticsEventIds>(TIMESTAMP_IDS_REFS_NAME, {}, {
  idAttribute: 'timestamp',
  mergeStrategy (entityA:AnalyticsEventIds, entityB:AnalyticsEventIds): AnalyticsEventIds {
    return entityA.concat(entityB)
  },
  processStrategy (entity: AnalyticsEvent) {
    return [entity.id]
  }
})

const timestampIdsRefsShema = new schema.Array(timestampIdsRefValueShema)

export namespace AnalyticsEvent {
    export function makeTimestampIdsRefs (events: AnalyticsEvent[]) {
      return normalize<AnalyticsEvent, TimestampIdsRefsEntities>(events, timestampIdsRefsShema).entities[TIMESTAMP_IDS_REFS_NAME]
    }

    export function reduceDuration (event: AnalyticsEvent, playerPausedAt: milliseconds):AnalyticsEvent {
      return { ...event, duration: event.timestamp + event.duration - playerPausedAt }
    }

    export function isActual (event: AnalyticsEvent, currentTimestamp: milliseconds) {
      return (currentTimestamp >= event.timestamp) && (currentTimestamp < event.timestamp + event.duration)
    }

}
