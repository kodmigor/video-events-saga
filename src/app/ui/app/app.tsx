import { MainPageView } from 'pages/main'
import React from 'react'
import { bemBlock } from 'shared/lib'
import './app.scss'

export function App () {
  const block = bemBlock('App')
  return (
        <div className={block()}>
            <MainPageView />
        </div>
  )
};
