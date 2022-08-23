import { analyticsEventModel } from 'entities/analytics-event'
import React from 'react'
import { useSelector } from 'react-redux'
import { eventViewBlock } from '../lib'
import type { AnalyticsEventView } from '../lib'
import './fired.scss'

export function AnalyticsEventFiredView ({ id, className }:AnalyticsEventView) {
  const event = useSelector(analyticsEventModel.getSelectorById(id))
  if (!event) return null

  return <div className={eventViewBlock({ fired: true }).mix(className)} style={{ ...event.zone }}/>
}
