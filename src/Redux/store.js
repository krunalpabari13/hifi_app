import {configureStore} from '@reduxjs/toolkit'
import { globalreducers } from './reducers';
const store=configureStore({
    reducer:{
        states:globalreducers.reducer
    }
})
export default store;