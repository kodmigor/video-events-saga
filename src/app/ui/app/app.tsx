import { VideoAnalyticsPageView } from 'pages/video-analytics'
import React from 'react'
import { bemBlock } from 'shared/lib'
import './app.scss'

export function App () {
  const block = bemBlock('App')
  return (
        <div className={block()}>
            <VideoAnalyticsPageView />
        </div>
  )
};
