import { EntityState } from '@reduxjs/toolkit'
import { setupStore } from 'app/store'
import { analyticsEventModel } from 'entities/analytics-event'
import { eventViewBlock } from 'entities/analytics-event/ui/event/lib'
import React from 'react'
import { AnalyticsEvent, AnalyticsEventStoreState } from 'shared/models'
import { renderWithStore } from 'test-utils'
import { createMock } from 'ts-auto-mock'
import { AnalyticsEventsListView } from './list'

describe('Analytics events list view', () => {
  const store = setupStore()
  const eventA = createMock<AnalyticsEvent>({ id: 3 })
  const eventB = createMock<AnalyticsEvent>({ id: 11 })
  const events = [eventA, eventB]
  let analyticsEvent: AnalyticsEventStoreState & EntityState<AnalyticsEvent>
  let renderEventsList : () => ReturnType<typeof renderWithStore>
  const eventViewCssSelector = `.${eventViewBlock.toString()}`
  function getEventViews (container: HTMLElement) {
    return container.querySelectorAll<HTMLDivElement>(eventViewCssSelector)!
  }

  beforeAll(() => {
    analyticsEvent = createMock<AnalyticsEventStoreState & EntityState<AnalyticsEvent>>()
    renderEventsList = () => renderWithStore(<AnalyticsEventsListView goToEvent={() => {}} />, { store })
    store.dispatch(analyticsEventModel.setAll(events))
  })

  test('should display correct number of events', () => {
    const { container } = renderEventsList()

    const eventViews = getEventViews(container)
    expect(eventViews.length).toBe(2)
  })
})
