import { AnalyticsEventInListView, analyticsEventModel } from 'entities/analytics-event'
import React from 'react'
import { useSelector } from 'react-redux'
import { bemBlock } from 'shared/lib'
import './list.scss'

const eventsListViewBlock = bemBlock('AnalyticsEventsList')

interface AnalyticsEventsListView {
  className?: string
}

export function AnalyticsEventsListView ({ className }: AnalyticsEventsListView) {
  const eventsIds = useSelector(analyticsEventModel.selectIds) as number[]

  const eventViews = React.useMemo(() => eventsIds.map((id) => <AnalyticsEventInListView id={id} key={id} />),
    [eventsIds.length])

  return <div className={eventsListViewBlock.mix(className)}>{eventViews}</div>
}
