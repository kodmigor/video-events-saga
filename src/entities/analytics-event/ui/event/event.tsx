import { analyticsEventModel } from 'entities/analytics-event'
import React from 'react'
import { useSelector } from 'react-redux'
import { bemBlock } from 'shared/lib'
import './event.scss'

type AnalyticsEventViewProps = {
    id: number
}

export function AnalyticsEventView ({ id }:AnalyticsEventViewProps) {
  const block = bemBlock('AnalyticsEvent')
  const event = useSelector(analyticsEventModel.getSelectorById(id))
  if (!event) return null

  return <div className={block()} style={{ ...event.zone }}/>
}
