import { analyticsEventModel, AnalyticsEventFiredView } from 'entities/analytics-event'
import React from 'react'
import { useSelector } from 'react-redux'
import { bemBlock } from 'shared/lib'
import './overlay.scss'

const eventsOverlayViewBlock = bemBlock('AnalyticsEventsOverlay')

interface AnalyticsEventsOverlayView {
  className?: string
}

export function AnalyticsEventsOverlayView ({ className }:AnalyticsEventsOverlayView) {
  const firedEventsIds = useSelector(analyticsEventModel.selectFiredIds)

  const eventViews = React.useMemo(() => firedEventsIds.map((id) => <AnalyticsEventFiredView id={id} key={id} />),
    [firedEventsIds.length])

  return <div className={eventsOverlayViewBlock.mix(className)}>{eventViews}</div>
}
