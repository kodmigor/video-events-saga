import { EntityState } from '@reduxjs/toolkit'
import { act } from '@testing-library/react'
import { setupStore } from 'app/store'
import { analyticsEventModel } from 'entities/analytics-event'
import { eventViewBlock } from 'entities/analytics-event/ui/event/lib'
import React from 'react'
import { AnalyticsEvent, AnalyticsEventStoreState } from 'shared/models'
import { renderWithStore } from 'test-utils'
import { createMock } from 'ts-auto-mock'
import { AnalyticsEventsOverlayView } from './overlay'

describe('Analytics events overlay view', () => {
  const store = setupStore()
  const eventA = createMock<AnalyticsEvent>({ id: 3 })
  const eventB = createMock<AnalyticsEvent>({ id: 11 })
  const events = [eventA, eventB]
  let analyticsEvent: AnalyticsEventStoreState & EntityState<AnalyticsEvent>
  let renderEventsOverlay : () => ReturnType<typeof renderWithStore>
  const eventViewCssSelector = `.${eventViewBlock.toString()}`
  function getEventViews (container: HTMLElement) {
    return container.querySelectorAll<HTMLDivElement>(eventViewCssSelector)!
  }

  beforeAll(() => {
    analyticsEvent = createMock<AnalyticsEventStoreState & EntityState<AnalyticsEvent>>()
    renderEventsOverlay = () => renderWithStore(<AnalyticsEventsOverlayView />, { store })
    store.dispatch(analyticsEventModel.setAll(events))
  })

  test('should display correct number of fired events', () => {
    const { container, rerender } = renderEventsOverlay()

    let eventViews = getEventViews(container)
    expect(eventViews.length).toBe(0)
    act(() => { store.dispatch(analyticsEventModel.fire(eventA.id)) })
    rerender(<AnalyticsEventsOverlayView />)
    eventViews = getEventViews(container)
    expect(eventViews.length).toBe(1)

    act(() => { store.dispatch(analyticsEventModel.fire(eventB.id)) })
    rerender(<AnalyticsEventsOverlayView />)
    eventViews = getEventViews(container)
    expect(eventViews.length).toBe(2)

    act(() => { store.dispatch(analyticsEventModel.drop(eventA.id)) })
    rerender(<AnalyticsEventsOverlayView />)
    eventViews = getEventViews(container)
    expect(eventViews.length).toBe(1)

    act(() => { store.dispatch(analyticsEventModel.drop(eventB.id)) })
    rerender(<AnalyticsEventsOverlayView />)
    eventViews = getEventViews(container)
    expect(eventViews.length).toBe(0)
  })
})
