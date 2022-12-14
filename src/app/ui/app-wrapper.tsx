import { setupStore } from 'app/store'
import React from 'react'
import { Provider } from 'react-redux'

import { App } from './app/app'

export function AppWrapper () {
  const store = setupStore()
  return (
        <Provider store={store}>
            <App />
        </Provider>
  )
};
