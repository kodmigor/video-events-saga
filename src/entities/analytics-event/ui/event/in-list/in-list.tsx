import { analyticsEventModel } from 'entities/analytics-event'
import dayjs from 'dayjs'
import React from 'react'
import { useSelector } from 'react-redux'
import { eventViewBlock, AnalyticsEventView } from '../lib'
import './in-list.scss'
import { milliseconds } from 'shared/lib'

export interface AnalyticsEventInListView extends AnalyticsEventView {
  goTo(timestamp: milliseconds): void
}

export function AnalyticsEventInListView ({ id, className, goTo }: AnalyticsEventInListView) {
  const event = useSelector(analyticsEventModel.getSelectorById(id))
  if (!event) return null

  return (
    <div
      className={eventViewBlock({ inList: true }).mix(className)}
      onClick={() => goTo(event.timestamp)}
    >
      <pre>{dayjs(event.timestamp).format('mm:ss:SSS')}</pre>
    </div>
  )
}
