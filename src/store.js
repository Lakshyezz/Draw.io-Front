import { configureStore } from '@reduxjs/toolkit';
import MenuReducer from './slice/menuSlice'
import ToolBoxSlice from './slice/toolBoxSlice'

export const store = configureStore({
    reducer: {
        menu: MenuReducer,
        toolbox: ToolBoxSlice,
    },
})