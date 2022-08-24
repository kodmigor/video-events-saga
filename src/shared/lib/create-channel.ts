import { PayloadActionCreator, PrepareAction } from '@reduxjs/toolkit/dist/createAction'
import { createAction } from '@reduxjs/toolkit'

export const CHANNEL_PREFIX = 'Channel ::' as const

type ChannelType<T extends string> = `${typeof CHANNEL_PREFIX} ${T}`

export function createChannel<T extends string = string>(type: T): PayloadActionCreator<void, ChannelType<T>>
export function createChannel<PA extends PrepareAction<any>,
  T extends string = string>(
  type: T,
  prepareAction?: PA,
): PayloadActionCreator<ReturnType<PA>['payload'], ChannelType<T>, PA>
export function createChannel (type:any, prepareAction?:any) {
  return createAction(`${CHANNEL_PREFIX} ${type}`, prepareAction)
}
