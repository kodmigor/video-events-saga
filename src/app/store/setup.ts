import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './root-reducer'
import { createLogger } from 'redux-logger'
import { rootSaga } from 'processes/root-saga'

const sagaMiddleware = createSagaMiddleware()

const logger = createLogger({
  collapsed: true
})

export function setupStore (preloadedState?: PreloadedState<AppState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: [
      sagaMiddleware,
      logger
    ]
  })
  sagaMiddleware.run(rootSaga)
  return store
}
