import { useEffect, useRef } from "react";
import {
  MdClose,
  MdDownload,
  MdFlip,
  MdRedo,
  MdRestartAlt,
  MdRotate90DegreesCcw,
  MdRotate90DegreesCw,
  MdUndo,
  MdUpload,
} from "react-icons/md";
import { Loader } from "../components/Loader";
import { usePostImageApi } from "../hooks/usePostImageApi";
import { Actions, useActionsHistory } from "./hooks/useActionsHistory";

export const ImageViewer = ({
  imageUrl,
  onCloseImage,
}: {
  imageUrl: string;
  onCloseImage: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const horizontalFlip = useRef<boolean>(false);
  const verticalFlip = useRef<boolean>(false);
  const degreesRef = useRef<number>(0);

  const { isLoading, postImage } = usePostImageApi();

  const {
    lastPastAction,
    nextAction,
    canUndo,
    canRedu,
    addActionToHistory,
    clearHistory,
    goBack,
    goForward,
  } = useActionsHistory();

  useEffect(() => {
    const image = document.createElement("img");
    image.addEventListener("load", () => onImageLoaded(image));
    image.src = imageUrl;
  }, [imageUrl]);

  const getScale = (image: HTMLImageElement) => {
    switch (degreesRef.current) {
      case 0:
      case 180:
        return Math.min(
          canvasRef.current!.offsetWidth / image.width,
          canvasRef.current!.offsetHeight / image.height
        );
      case 90:
      case 270:
        return Math.min(
          canvasRef.current!.offsetWidth / image.height,
          canvasRef.current!.offsetHeight / image.width
        );
    }
    return 1;
  };

  const flipIfNeeded = (ctx: CanvasRenderingContext2D) => {
    if (horizontalFlip.current) {
      ctx.scale(-1, 1);
      ctx.translate(-ctx.canvas.offsetWidth, 0);
    }

    if (verticalFlip.current) {
      ctx.scale(1, -1);
      ctx.translate(0, -ctx.canvas.offsetHeight);
    }
  };

  const getImageDimensions = (image: HTMLImageElement): [number, number] => {
    const scale = getScale(image);

    const width = image.width * scale;
    const height = image.height * scale;

    return [width, height];
  };

  const updateCanvasWithImage = () => {
    const image = loadedImageRef.current;
    if (!image) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const [width, height] = getImageDimensions(image);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    flipIfNeeded(ctx);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((degreesRef.current * Math.PI) / 180);

    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  };

  const onImageLoaded = (image: HTMLImageElement) => {
    URL.revokeObjectURL(imageUrl);
    loadedImageRef.current = image;

    updateCanvasWithImage();
  };

  const rotateBy = (degrees: number): void => {
    const newValue = (degreesRef.current + degrees) % 360;
    degreesRef.current = newValue < 0 ? 360 + newValue : newValue;
  };

  const toggleHorizontalFlip = () => {
    horizontalFlip.current = !horizontalFlip.current;
  };

  const toggleVerticalFlip = () => {
    verticalFlip.current = !verticalFlip.current;
  };

  const reset = () => {
    horizontalFlip.current = false;
    verticalFlip.current = false;
    degreesRef.current = 0;
    clearHistory();
    updateCanvasWithImage();
  };

  const undo = () => {
    if (!lastPastAction) return;

    switch (lastPastAction) {
      case Actions.rotateRight:
        runAction(Actions.rotateLeft, false);
        break;
      case Actions.rotateLeft:
        runAction(Actions.rotateRight, false);
        break;
      case Actions.flipHorizontal:
        runAction(Actions.flipHorizontal, false);
        break;
      case Actions.flipVertical:
        runAction(Actions.flipVertical, false);
        break;
      case Actions.zoomIn:
        break;
      case Actions.zoomOut:
        break;
    }

    goBack();
  };

  const redo = () => {
    if (!nextAction) return;

    runAction(nextAction, false);
    goForward();
  };

  const runAction = (action: Actions, recordHistory: boolean = true) => {
    switch (action) {
      case Actions.rotateRight:
        rotateBy(90);
        break;
      case Actions.rotateLeft:
        rotateBy(-90);
        break;
      case Actions.flipHorizontal:
        toggleHorizontalFlip();
        break;
      case Actions.flipVertical:
        toggleVerticalFlip();
        break;
      case Actions.zoomIn:
        break;
      case Actions.zoomOut:
        break;
    }

    updateCanvasWithImage();

    if (recordHistory) {
      addActionToHistory(action);
    }
  };

  const onUpload = () => {
    // TODO: implement the upload functionality
    postImage();
  };

  const onDownload = () => {
    const imageUrl = getCanvasImageUrl();
    if (!imageUrl) return;

    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "image.jpg";
    a.click();
  };

  const getCanvasImageUrl = () => {
    // get image data from visible canvas
    const image = loadedImageRef.current;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx || !image) return;

    // TODO: review image data extractions
    // currently, it's not extracted properly
    const [width, height] = getImageDimensions(image);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((degreesRef.current * Math.PI) / 180);
    const imageData = ctx.getImageData(-width / 2, -height / 2, width, height);
    ctx.restore();

    // create a new canvas with the image data with no extra space
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = imageData.width;
    imageCanvas.height = imageData.height;

    const context = imageCanvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    context.putImageData(imageData, 0, 0);
    const imageUrl = imageCanvas.toDataURL("image/jpg");
    return imageUrl;
  };

  useEffect(() => {
    window.addEventListener("resize", updateCanvasWithImage);
    return () => window.removeEventListener("resize", updateCanvasWithImage);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {/* TODO: move these actions in a solo component */}
      <div className="flex gap-2 p-2 text-2xl">
        <button
          className="button-icon"
          onClick={() => runAction(Actions.rotateLeft)}
        >
          <MdRotate90DegreesCcw />
        </button>
        <button
          className="button-icon"
          onClick={() => runAction(Actions.rotateRight)}
        >
          <MdRotate90DegreesCw />
        </button>
        <button
          className="button-icon"
          onClick={() => runAction(Actions.flipHorizontal)}
        >
          <MdFlip />
        </button>
        <button
          className="button-icon"
          onClick={() => runAction(Actions.flipVertical)}
        >
          <MdFlip className="rotate-90" />
        </button>
        {/* TODO */}
        {/* <button className="button-icon" onClick={() => {}}>
          <MdZoomIn />
        </button>
        <button className="button-icon" onClick={() => {}}>
          <MdZoomOut />
        </button> */}
        <button className="button-icon" onClick={reset}>
          <MdRestartAlt />
        </button>

        <button className="button-icon" onClick={undo} disabled={!canUndo}>
          <MdUndo className={canUndo ? "" : "opacity-50"} />
        </button>

        <button className="button-icon" onClick={redo} disabled={!canRedu}>
          <MdRedo className={canRedu ? "" : "opacity-50"} />
        </button>
        <button className="button-icon ml-auto" onClick={onDownload}>
          <MdDownload />
        </button>
        <button className="button-icon" onClick={onUpload}>
          <MdUpload />
        </button>
        <button className="button-icon" onClick={onCloseImage}>
          <MdClose />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        height="100%"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        id="canvas"
      ></canvas>

      {isLoading && <Loader fullScreen={true} />}
    </div>
  );
};
