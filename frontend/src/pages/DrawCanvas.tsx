import React, { useEffect, useRef, useState } from "react";

export const Drawing = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;

    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        contextRef.current! = context;
        context.fillStyle = "salmon";
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
