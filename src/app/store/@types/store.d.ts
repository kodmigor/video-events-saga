import { store } from '../store'

declare global {
    type RootState = ReturnType<typeof store.getState>;
}
