import { EntityState } from '@reduxjs/toolkit'
import React from 'react'
import dayjs from 'dayjs'
import { milliseconds } from 'shared/lib'
import { AnalyticsEvent, AnalyticsEventStoreState } from 'shared/models'
import { renderWithStore } from 'test-utils'
import { createMock } from 'ts-auto-mock'
import { eventViewBlock } from '../lib/bem-block'
import { AnalyticsEventInListView } from './in-list'

describe('Analytics event in list view', () => {
  let timestamp:milliseconds
  let event: AnalyticsEvent
  let analyticsEvent: AnalyticsEventStoreState & EntityState<AnalyticsEvent>
  let renderEvent : (eventId: number) => ReturnType<typeof renderWithStore>
  const eventViewCssSelector = `.${eventViewBlock.toString()}`
  const eventTimestampCssSelector = `.${eventViewBlock.toString()} pre`

  beforeAll(() => {
    timestamp = 320303
    event = createMock<AnalyticsEvent>({ id: 11, timestamp })
    analyticsEvent = createMock<AnalyticsEventStoreState & EntityState<AnalyticsEvent>>({
      entities: { [event.id]: { ...event } },
      ids: [event.id]
    })
    renderEvent = (eventId) => renderWithStore(
    <AnalyticsEventInListView id={eventId} />,
    { preloadedState: { entities: { analyticsEvent } } }
    )
  })

  test('should contain formatted timestamp ', () => {
    const { container } = renderEvent(event.id)
    const eventTimestamp = container.querySelector<HTMLDivElement>(eventTimestampCssSelector)!

    expect(eventTimestamp.textContent).toEqual(dayjs(event.timestamp).format('mm:ss:SSS'))
  })

  test('should return null if store has not event with id passed into component ', () => {
    const { container } = renderEvent(1)
    const eventView = container.querySelector<HTMLDivElement>(eventViewCssSelector)!

    expect(eventView).toBeNull()
  })
})
