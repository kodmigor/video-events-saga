import { analyticsEventModel } from 'entities/analytics-event'
import { VideoAnalyticsPageView } from 'pages/video-analytics'
import React from 'react'
import { useSelector } from 'react-redux'
import { bemBlock } from 'shared/lib'
import './app.scss'

export function App () {
  const block = bemBlock('App')
  const loading = useSelector(analyticsEventModel.selectLoading)
  return (
        <div className={block()}>
            <VideoAnalyticsPageView />
        </div>
  )
};
