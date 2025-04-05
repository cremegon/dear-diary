import React, { useEffect, useRef, useState } from "react";

export const Drawing = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brush, setBrush] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [color, setColor] = useState("fff");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // ---- Create the Canvas Grid on Launch
  useEffect(() => {
    const canvas = canvasRef.current!;

    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        contextRef.current! = context;
        context.strokeStyle = "salmon";

        //draw vertical grid
        for (let i = 0; i <= 300; i += 20) {
          context.beginPath();
          context.moveTo(i, 0);
          context.lineTo(i, 460);
          context.stroke();
        }

        //draw horizontal grid
        for (let i = 0; i <= 460; i += 20) {
          context.beginPath();
          context.moveTo(0, i);
          context.lineTo(460, i);
          context.stroke();
        }
      }
    }
  }, []);

  // ---- Reset the Canvas Colors etc
  useEffect(() => {
    const canvas = canvasRef.current!;

    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = color;
      }
    }
  }, [color]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);

    contextRef.current!.beginPath();
    contextRef.current!.moveTo(
      Math.floor(e.nativeEvent.offsetX / 20) * 20,
      Math.floor(e.nativeEvent.offsetY / 20) * 20
    );
    contextRef.current!.fillRect(
      Math.floor(e.nativeEvent.offsetX / 20) * 20,
      Math.floor(e.nativeEvent.offsetY / 20) * 20,
      20,
      20
    );
  };

  const traceDrawing = (e: React.MouseEvent) => {
    if (!isDrawing) {
      return;
    }

    contextRef.current!.fillRect(
      Math.floor(e.nativeEvent.offsetX / 20) * 20,
      Math.floor(e.nativeEvent.offsetY / 20) * 20,
      20,
      20
    );
    contextRef.current!.lineTo(
      Math.floor(e.nativeEvent.offsetX / 20) * 20,
      Math.floor(e.nativeEvent.offsetY / 20) * 20
    );
  };

  const stopDrawing = () => {
    contextRef.current!.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
      <div id="toolbar" className="flex flex-row ">
        <div
          onClick={() => setBrush(!brush)}
          id="brush"
          className={`w-20 h-20 ${brush ? "bg-green-400" : "bg-red-400"} items-center justify-center mr-4`}
        >
          <p>Brush</p>
        </div>

        <div
          onClick={() => setEraser(!eraser)}
          id="eraser"
          className={`w-20 h-20 ${eraser ? "bg-green-400" : "bg-red-400"} items-center justify-center mr-4`}
        >
          <p>Erase</p>
        </div>

        <input
          onChange={(e) => setColor(e.target.value)}
          type="color"
          className="w-20 h-20"
        />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={traceDrawing}
        onMouseUp={stopDrawing}
        width={300}
        height={460}
        style={{ backgroundColor: "maroon" }}
      />
    </div>
  );
};

export default Drawing;
