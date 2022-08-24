import { createAction } from '@reduxjs/toolkit'
import { AnalyticsEvent } from 'shared/models'

export type getAll = ReturnType<typeof getAll>;
export const getAll = createAction('Get analytics events', () => ({
  payload: {
    async request (): Promise<AnalyticsEvent[]> {
      return fetch('http://www.mocky.io/v2/5e60c5f53300005fcc97bbdd').then(
        (res) => res.json() || []
      )
    }
  }
}))
