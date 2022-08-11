import { analyticsEventModel, AnalyticsEventView } from 'entities/analytics-event'
import React from 'react'
import { useSelector } from 'react-redux'

export function AnalyticsEventsOverlay () {
  const firedEventIds = useSelector(analyticsEventModel.selectFiredIds)

  const eventViews = firedEventIds.map((id) => <AnalyticsEventView id={id} key={id} />)

  return <div style={{ position: 'absolute', width: '100%', height: '100%' }}>{eventViews}</div>
}
