import { normalize, schema } from 'normalizr'

export type AnalyticsEvent = {
    id: number
    timestamp: number
    duration: number
    zone: {
        left: number
        top: number
        width: number
        height: number
    }
}

const TIMESTAMP_IDS_REFS_NAME = 'timestampIdsRefs' as const

type AnalyticsEventIds = Array<number>

export type TimestampIdsRefs = Record<number, AnalyticsEventIds>
export type AnalyticsEventStoreState = {
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

}
