import { COLORS, MENU_ITEMS } from "@/constants";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  
    [MENU_ITEMS.PENCIL] : {
        color: COLORS.BLACK,
        size: 2,
    },
    [MENU_ITEMS.ERASER] : {
        color: COLORS.WHITE,
        size: 2,
    },
    [MENU_ITEMS.UNDO] : {},
    [MENU_ITEMS.REDO] : {},
    [MENU_ITEMS.DOWNLOAD] : {},
    
   // activeColor: COLORS.BLACK,    // This is how i was trying to implement this slice
    // activeBrushSize: 1,  
};

export const toolBoxSlice = createSlice({
    name: 'toolbox',
    initialState: initialState,
    reducers: {
        changeColor : (state, action) => {
            state[action.payload.item].color = action.payload.color;
        },
        changeBrushSize : (state, action) => {
            state[action.payload.item].size = action.payload.size;
        },
    }
});

export const { changeColor, changeBrushSize } = toolBoxSlice.actions;
export default toolBoxSlice.reducer