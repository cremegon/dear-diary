import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchCoverArt, saveCoverArt } from "../../util/diary.ts";
import { drawImageToCanvas } from "../../util/client.ts";

export const Drawing = () => {
  const param = useParams();
  const [queryParam, setQueryParam] = useSearchParams();
  const edit = queryParam.get("edit") === "true";
  const diaryURL = param.diaryId;
  const bgColor = "white";
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [cover, setCover] = useState("");
  const [brush, setBrush] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [color, setColor] = useState("black");

  const referenceRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // ---- Create the Canvas Grid on Launch
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current!;
    const drawingCanvas = canvasRef.current!;

    createGrid(bgCanvas, drawingCanvas);
    async function getCoverArt() {
      if (!cover) {
        const coverArtURL = await fetchCoverArt(diaryURL as string);
        setCover(coverArtURL);
        drawImageToCanvas(canvasRef, coverArtURL);
      }
    }
    if (!edit) return;
    getCoverArt();
  }, [cover, diaryURL, edit]);

  // ---- Reset the Canvas Colors etc
  useEffect(() => {
    const canvas = canvasRef.current!;

    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        if (brush) {
          console.log("brush: ", brush, color);
          context.fillStyle = color;
        } else if (eraser) {
          console.log("eraser: ", eraser, bgColor);
          context.fillStyle = "rgba(255,255,255,0)";
        }
      }
    }
  }, [color, eraser, brush]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!brush && !eraser) return;

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

  const startErase = (e: React.MouseEvent) => {
    if (!brush && !eraser) return;
    if (!eraser && brush) return;

    setIsErasing(true);
    console.log(contextRef.current!);
    contextRef.current!.clearRect(
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
    setIsErasing(false);
  };

  const traceErase = (e: React.MouseEvent) => {
    if (!isErasing) {
      return;
    }

    contextRef.current!.clearRect(
      Math.floor(e.nativeEvent.offsetX / 20) * 20,
      Math.floor(e.nativeEvent.offsetY / 20) * 20,
      20,
      20
    );
  };

  function handleToggle(e: EventTarget) {
    const element = e as HTMLElement;
    const buttonId = element.id;
    if (buttonId === "brush") {
      if (eraser && !brush) {
        setEraser(false);
        setBrush(!brush);
      } else {
        setBrush(!brush);
      }
    } else if (buttonId === "eraser") {
      if (brush && !eraser) {
        setBrush(false);
        setEraser(!eraser);
      } else {
        setEraser(!eraser);
      }
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (brush && !eraser) {
      startDrawing(e);
    } else {
      startErase(e);
    }
  }

  function handleDrag(e: React.MouseEvent) {
    if (isDrawing) {
      traceDrawing(e);
    } else if (isErasing) {
      traceErase(e);
    }
  }

  function createGrid(
    bgCanvas: HTMLCanvasElement,
    drawingCanvas: HTMLCanvasElement
  ) {
    if (bgCanvas && drawingCanvas) {
      const context = bgCanvas?.getContext("2d");
      const drawingContext = drawingCanvas.getContext("2d");
      if (context && drawingContext) {
        contextRef.current! = drawingContext;
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
  }

  async function handleUploadImage(diaryId: string) {
    const image = canvasRef.current?.toDataURL() as string;
    const reference = referenceRef.current?.toDataURL() as string;
    if (image === reference) return;
    console.log("no sir...");
    const response = await saveCoverArt(image, diaryId);
    if (response) {
      drawImageToCanvas(referenceRef, image);
      queryParam.set("edit", "true");
      setQueryParam(queryParam);
    }
  }

  return (
    <div className="h-full">
      <div id="toolbar" className="flex flex-row ">
        <div
          onClick={(e) => handleToggle(e.target)}
          id="brush"
          className={`w-20 h-20 ${brush ? "bg-green-400" : "bg-red-400"} items-center justify-center mr-4`}
        >
          <p>Brush</p>
        </div>

        <div
          onClick={(e) => handleToggle(e.target)}
          id="eraser"
          className={`w-20 h-20 ${eraser ? "bg-green-400" : "bg-red-400"} items-center justify-center mr-4`}
        >
          <p>Erase</p>
        </div>

        <input
          onChange={(e) => setColor(e.target.value)}
          type="color"
          className="w-20 h-20 mr-4"
        />
        <button
          onClick={() => handleUploadImage(diaryURL as string)}
          className="btn-writeUI"
        >
          Save Image
        </button>
      </div>
      <div className="w-full h-svh relative">
        <canvas
          id="gridLayer"
          ref={bgCanvasRef}
          width={300}
          height={460}
          style={{
            borderColor: "salmon",
            borderWidth: 2,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <canvas
          id="drawingLayer"
          ref={canvasRef}
          onMouseDown={handleClick}
          onMouseMove={handleDrag}
          onMouseUp={stopDrawing}
          width={300}
          height={460}
          style={{
            backgroundColor: bgColor,
            borderColor: "salmon",
            borderWidth: 2,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <canvas
          id="referenceLayer"
          ref={referenceRef}
          width={300}
          height={460}
          style={{
            backgroundColor: bgColor,
            borderColor: "salmon",
            borderWidth: 2,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      </div>
    </div>
  );
};

export default Drawing;
