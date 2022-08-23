import { EntityState } from '@reduxjs/toolkit'
import React from 'react'
import { AnalyticsEvent, AnalyticsEventStoreState } from 'shared/models'
import { renderWithStore } from 'test-utils'
import { createMock } from 'ts-auto-mock'
import { AnalyticsEventView, eventViewBlock } from './event'

describe('Analytics event view', () => {
  let zone:AnalyticsEvent['zone']
  let event: AnalyticsEvent
  let analyticsEvent: AnalyticsEventStoreState & EntityState<AnalyticsEvent>
  let renderEvent : (eventId: number) => ReturnType<typeof renderWithStore>
  const eventViewCssSelector = `.${eventViewBlock.toString()}`

  beforeAll(() => {
    zone = { height: 20, left: 50, top: 25, width: 30 }
    event = createMock<AnalyticsEvent>({ id: 11, zone })
    analyticsEvent = createMock<AnalyticsEventStoreState & EntityState<AnalyticsEvent>>({
      entities: { [event.id]: { ...event } },
      ids: [event.id]
    })
    renderEvent = (eventId) => renderWithStore(
      <AnalyticsEventView id={eventId} />,
      { preloadedState: { entities: { analyticsEvent } } }
    )
  })

  test('should be displayed with correct zone styles ', () => {
    const { container } = renderEvent(event.id)
    const eventView = container.querySelector<HTMLDivElement>(eventViewCssSelector)!

    expect(eventView.style.height).toEqual(`${zone.height}px`)
    expect(eventView.style.left).toEqual(`${zone.left}px`)
    expect(eventView.style.top).toEqual(`${zone.top}px`)
    expect(eventView.style.width).toEqual(`${zone.width}px`)
  })

  test('should return null if store has not event with id passed into component ', () => {
    const { container } = renderEvent(1)
    const eventView = container.querySelector<HTMLDivElement>(eventViewCssSelector)!

    expect(eventView).toBeNull()
  })
})
