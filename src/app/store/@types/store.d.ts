import { rootReducer } from '../root-reducer'
import { setupStore } from '../setup'

declare global {
    type AppState = ReturnType<typeof rootReducer>;
    type AppStore = ReturnType<typeof setupStore>
}
