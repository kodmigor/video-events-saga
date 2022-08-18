import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './root-reducer'
import { createLogger } from 'redux-logger'
import { rootSaga } from 'processes/root-saga'

const sagaMiddleware = createSagaMiddleware()

const logger = createLogger({
  collapsed: true
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    sagaMiddleware,
    logger
  ] as const
})

sagaMiddleware.run(rootSaga)
