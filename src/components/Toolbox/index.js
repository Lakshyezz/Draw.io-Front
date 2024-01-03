import React from 'react'
import cx from 'classnames'
import styles from './index.module.css'
import {COLORS, MENU_ITEMS} from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { changeBrushSize, changeColor } from '@/slice/toolBoxSlice'
import { socket } from '@/socket'

const ToolBox = () => {
    const dispatch = useDispatch();
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
    const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
    const showBrushToolOption = activeMenuItem === MENU_ITEMS.ERASER || activeMenuItem === MENU_ITEMS.PENCIL;
    const {color,size} = useSelector((state) => state.toolbox[activeMenuItem]);
    const updateBrushSize = (e) => {
        dispatch(changeBrushSize({item: activeMenuItem,size: e.target.value}))
        socket.emit('changeConfig', { color,size: e.target.value });
        // console.log("e => " + (e.target.value));
    }

    const updateColor = (newColor) => {
        dispatch(changeColor({item: activeMenuItem,color: newColor}))
        socket.emit('changeConfig', {color: newColor, size})
    }

return (
    <div className= {styles.toolBoxContainer}>
        {showStrokeToolOption &&  <div className={styles.toolItem}>
            <h4 className={styles.toolText}>Stroke</h4>
            <div className={styles.itemContainer}>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.BLACK})} onClick={()=> updateColor(COLORS.BLACK)}
                        style={{backgroundColor: COLORS.BLACK}}/>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.RED})} onClick={()=> updateColor(COLORS.RED)}
                        style={{backgroundColor: COLORS.RED}}/>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.GREEN})} onClick={()=> updateColor(COLORS.GREEN)}
                        style={{backgroundColor: COLORS.GREEN}}/>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.BLUE})} onClick={()=> updateColor(COLORS.BLUE)}
                        style={{backgroundColor: COLORS.BLUE}}/>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.ORANGE})} onClick={()=> updateColor(COLORS.ORANGE)}
                        style={{backgroundColor: COLORS.ORANGE}}/>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.YELLOW})} onClick={()=> updateColor(COLORS.YELLOW)}
                        style={{backgroundColor: COLORS.YELLOW}}/>
                <div className={cx(styles.colorBox,{[styles.active] : color === COLORS.WHITE})} onClick={()=> updateColor(COLORS.WHITE)}
                        style={{backgroundColor: COLORS.WHITE}}/>
            </div>
        </div>}
      {showBrushToolOption && <div className={styles.toolItem}>
            <h4 className={styles.toolText}>Brush Size {activeMenuItem}</h4>
            <div className={styles.itemContainer}>
                <input type='range' min={1} max={10} step={1}
                    onChange={updateBrushSize} value={size}
                /> 
            </div>   
        </div>}
    </div>
  )
}

export default ToolBox