import { MENU_ITEMS } from '@/constants';
import { actionItemClick } from '@/slice/menuSlice';
import { socket } from '@/socket';
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Board = () => {

    const canvasRef = useRef(null);
    const nowDraw = useRef(false);
    const drawHistory = useRef([]);
    const historyPointer = useRef(0);  // will be used to travers array of drawHistory
    const dispatch = useDispatch();
  
    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu);
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem]);

    socket.on("connect", () => {
      console.log("client connected"); // x8WIv7-mJelg7on_ALbx
    });
    
    useEffect(()=>{
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
        const URL = canvas.toDataURL();
        const anchor = document.createElement('a')
        anchor.href = URL
        anchor.download = 'sketch.png'
        anchor.click()
        // console.log("anchor.href => " + JSON.stringify(anchor.href));

        // [one ,two ,three, four] p =3
      }else if(actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO){
        if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1;
        if(historyPointer.current < drawHistory.current.length-1 && actionMenuItem === MENU_ITEMS.REDO){
          historyPointer.current +=1;
        }
        const imageData = drawHistory.current[historyPointer.current];
        context.putImageData(imageData, 0, 0)
      } 
      dispatch(actionItemClick(null))
    },[actionMenuItem, dispatch]);

    useEffect(()=>{
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

     const changeConfig = (color, size) => {
      context.lineWidth = size
      context.strokeStyle = color
     }
     const handleChangeConfig = (config) => {
       changeConfig(config.color , config.size );
      }
      changeConfig(color,size);
      socket.on('changeConfig', handleChangeConfig)
      
      return () => {
        socket.off('changeConfig', handleChangeConfig);
      }
    }, [color, size])

    // before browser paints || useLayoutEffect runs before useEffect
    useLayoutEffect(()=>{
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // when mounting
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const beginPath = (x,y) => {
        context.beginPath();
        context.moveTo(x,y)
      }
      const drawLine = (x,y) => {
        context.lineTo(x,y);
        context.stroke();   // method draws the current path.
      }

      const handleMouseDown = (e) => {
        nowDraw.current = true
        beginPath(e.clientX, e.clientY);
        socket.emit('beginPath' , {x: e.clientX, y: e.clientY})
      }
      const handleMouseMove = (e) => {
        if(!nowDraw.current) return;
        drawLine(e.clientX, e.clientY);
        socket.emit('drawLine' , {x: e.clientX, y: e.clientY})
      }
      const handleMouseUp = (e) => {
        nowDraw.current = false;
        historyPointer.current = drawHistory.current.length - 1;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        drawHistory.current.push(imageData)
      }
    
      const handleBeginPath = (path) =>{
        beginPath(path.x, path.y)
      }
      const handleDrawLine = (path) => {
        drawLine(path.x, path.y)
      }

      // mousepressed
      canvas.addEventListener('mousedown', handleMouseDown);
      // mousehold
      canvas.addEventListener('mousemove', handleMouseMove);
      // mouseleave
      canvas.addEventListener('mouseup', handleMouseUp);

      socket.on('beginPath', handleBeginPath)
      socket.on('drawLine', handleDrawLine)
      
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);

        socket.off('beginPath', handleBeginPath)
        socket.off('drawLine', handleDrawLine)
      }
    },[]);
      
    // console.log(" color and size => ",color, size);
  return (
    <canvas ref={canvasRef}>  </canvas>
  )
}

export default Board