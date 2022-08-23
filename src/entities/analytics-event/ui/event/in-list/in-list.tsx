import { analyticsEventModel } from 'entities/analytics-event'
import dayjs from 'dayjs'
import React from 'react'
import { useSelector } from 'react-redux'
import { eventViewBlock, AnalyticsEventView } from '../lib'
import './in-list.scss'

export function AnalyticsEventInListView ({ id, className }: AnalyticsEventView) {
  const event = useSelector(analyticsEventModel.getSelectorById(id))
  if (!event) return null

  return (
    <div className={eventViewBlock({ inList: true }).mix(className)} >
      <pre>{dayjs(event.timestamp).format('mm:ss:SSS')}</pre>
    </div>
  )
}
