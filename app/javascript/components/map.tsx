import React, { useState, useEffect, MouseEvent } from 'react'
import { DrawMap } from '../drawing/draw-map';
import { DrawPixi } from '../drawing/draw-pixi';

const Map = (): JSX.Element => {

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [map, setMap] = useState<DrawMap>(new DrawMap());

  const handleResize = (e: any) => {
    console.log(e)
  };

  useEffect(() => {

    new DrawPixi().Init(canvasRef.current, map);

    

    //canvasRef.current.onresize


    //return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    console.log(e)
  };

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    console.log(e)
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    console.log(e)
  };

  const handleMouseOut = (e: MouseEvent<HTMLCanvasElement>) => {
    console.log(e)
  };

  const handleContextMenu = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  console.log("im being rendered");

  function drawAll() {

  }

  return (
    <canvas
      id='canvasMap'
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      onContextMenu={handleContextMenu}
      >
      Your browser does not support canvas.
    </canvas>
    );
}

export default Map