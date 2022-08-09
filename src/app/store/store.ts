import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './root-reducer'
import logger from 'redux-logger'
import { rootSaga } from 'processes/root-saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, logger] as const
})

sagaMiddleware.run(rootSaga)
