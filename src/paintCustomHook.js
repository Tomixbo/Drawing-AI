import { useCallback, useEffect, useRef, useState } from 'react';

const usePaintCustomHook = (width, height, canvasRef, updateTransformedImage) => {
  const lastX = useRef(0);
  const lastY = useRef(0);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Initial background color to white
  const [thickness, setThickness] = useState(2);
  const [opacity, setOpacity] = useState(100); // Initial opacity
  const [activeTool, setActiveTool] = useState('brush');
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [pressureSensitivity, setPressureSensitivity] = useState(false); // Pressure sensitivity state

  const ctx = useRef(null);
  const drawingInProgress = useRef(false);

  const captureState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && ctx.current) {
      const newHistory = [...history];
      newHistory.push(ctx.current.getImageData(0, 0, width, height));
      setHistory(newHistory);

      setRedoStack([]); // Clear the redo stack
    }
  }, [history, width, height, canvasRef]);

  // Function to handle drawing on the canvas
  // const [pressureMultiplier, setPressureMultiplier] = useState(0.5); // Sensibilité de la pression
  const pressureMultiplier = 0.4; 

  const draw = useCallback((event) => {
    if (!drawingInProgress.current || !ctx.current) return;
  
    if (activeTool === 'eraser') {
      ctx.current.strokeStyle = backgroundColor;
    } else {
      ctx.current.strokeStyle = currentColor;
      ctx.current.globalAlpha = pressureSensitivity ? Math.min((event.pressure || 0.1) * pressureMultiplier * (opacity / 100), 1) : opacity / 100;
    }
  
    ctx.current.beginPath();
    ctx.current.moveTo(lastX.current, lastY.current);
    ctx.current.lineTo(event.offsetX, event.offsetY);
    ctx.current.stroke();
    [lastX.current, lastY.current] = [event.offsetX, event.offsetY];
  }, [activeTool, currentColor, backgroundColor, opacity, pressureSensitivity, pressureMultiplier]);
  
  // Ajoutez une fonction pour mettre à jour le multiplicateur de pression
  // const handlePressureMultiplierChange = (value) => {
  //   setPressureMultiplier(value);
  // };

  // Function to handle mouse down event
  const handleMouseDown = useCallback((e) => {
    if (activeTool === 'brush' || activeTool === 'eraser') {
      drawingInProgress.current = true;
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    }
  }, [activeTool]);

  // Function to stop drawing
  const stopDrawing = useCallback(() => {
    drawingInProgress.current = false;
    if (activeTool !== 'fill') {
      captureState();
      updateTransformedImage();
    }
  }, [captureState, activeTool, updateTransformedImage]);

  // Function to handle color change
  const handleColor = (e) => {
    setCurrentColor(e.currentTarget.value);
  };

  // Function to handle background color change
  const handleBackgroundColor = (e) => {
    setBackgroundColor(e.currentTarget.value);
  };

  // Function to activate the eraser tool
  const handleEraser = () => {
    setActiveTool('eraser');
  };

  // Function to activate the brush tool
  const handleBrush = () => {
    setActiveTool('brush');
  };

  // Function to activate the fill tool
  const handleFillTool = () => {
    setActiveTool('fill');
  };

  // Function to handle brush thickness change
  const handleThickness = (value) => {
    setThickness(value);
  };

  // Function to handle opacity change
  const handleOpacity = (value) => {
    setOpacity(value);
  };

  // Function to handle pressure sensitivity change
  const handlePressureSensitivity = () => {
    setPressureSensitivity(!pressureSensitivity);
  };

  // Function to clean the canvas
  const handleClean = () => {
    const canvas = canvasRef.current;
    if (ctx.current) {
      ctx.current.clearRect(0, 0, width, height);

      // Fill the canvas with white color
      ctx.current.fillStyle = 'white';
      ctx.current.fillRect(0, 0, canvas.width, canvas.height);
      captureState();
      updateTransformedImage();
    }
  };

  // Function to initialize the canvas
  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas?.getContext('2d');
    if (ctx.current) {
      canvas.width = width;
      canvas.height = height;
      ctx.current.lineJoin = 'round';
      ctx.current.lineCap = 'round';
      ctx.current.fillStyle = 'white';
      ctx.current.fillRect(0, 0, canvas.width, canvas.height);
      const initialImageData = ctx.current.getImageData(0, 0, width, height);
      setHistory([initialImageData]);
    }
  }, [width, height, canvasRef]);

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    const lastState = newHistory.pop();
    setHistory(newHistory);

    const newRedoStack = [...redoStack];
    newRedoStack.push(lastState);
    setRedoStack(newRedoStack);

    if (ctx.current) {
      ctx.current.putImageData(newHistory[newHistory.length - 1], 0, 0);
    }
    updateTransformedImage();
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const redoState = newRedoStack.pop();
    setRedoStack(newRedoStack);

    const newHistory = [...history];
    newHistory.push(redoState);
    setHistory(newHistory);

    if (ctx.current) {
      ctx.current.putImageData(redoState, 0, 0);
    }
    updateTransformedImage();
  };

  // Function to handle fill image action on the canvas
  const handleFillImage = (img) => {
    if (ctx.current) {
      ctx.current.clearRect(0, 0, width, height);
      ctx.current.drawImage(img, 0, 0, width, height);
      captureState();
      updateTransformedImage();
    }
  };

  // Function to handle apply transformed image
  const handleApplyTransformedImage = (transformedImageSrc) => {
    const img = new Image();
    img.src = transformedImageSrc;
    img.onload = () => {
      if (ctx.current) {
        ctx.current.clearRect(0, 0, width, height);
        ctx.current.drawImage(img, 0, 0, width, height);
        captureState();
        updateTransformedImage();
      }
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('pointermove', draw);
      canvas.addEventListener('pointerup', stopDrawing);
      canvas.addEventListener('pointerdown', handleMouseDown);
      canvas.addEventListener('pointerout', () => {
        if (drawingInProgress.current) {
          drawingInProgress.current = false;
        }
      });

      return () => {
        canvas.removeEventListener('pointermove', draw);
        canvas.removeEventListener('pointerup', stopDrawing);
        canvas.removeEventListener('pointerdown', handleMouseDown);
        canvas.removeEventListener('pointerout', () => {
          if (drawingInProgress.current) {
            drawingInProgress.current = false;
          }
        });
      };
    }
  }, [draw, handleMouseDown, stopDrawing, canvasRef]);

  // Function to handle fill action on the canvas
  const handleFill = (startX, startY) => {
    if (activeTool !== 'fill' || !ctx.current) return;

    // Adjust coordinates to canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(startX - rect.left);
    const y = Math.floor(startY - rect.top);

    const fillColor = hexToRgb(currentColor);
    const imageData = ctx.current.getImageData(0, 0, width, height);
    const data = imageData.data;
    const stack = [[x, y]];
    const baseColor = getPixel(data, x, y);

    if (colorsMatch(baseColor, fillColor)) return;

    const widthBound = width - 1;
    const heightBound = height - 1;

    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || y < 0 || x > widthBound || y > heightBound) continue;

      const currentColor = getPixel(data, x, y);

      if (colorsMatch(currentColor, baseColor)) {
        setPixel(data, x, y, fillColor);
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    ctx.current.putImageData(imageData, 0, 0);
    captureState();
    updateTransformedImage();
  };

  // Function to convert hex color to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
  };

  // Function to get pixel color data
  const getPixel = (data, x, y) => {
    const index = (x + y * width) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  // Function to set pixel color data
  const setPixel = (data, x, y, color) => {
    const index = (x + y * width) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
  };

  // Function to check if colors match
  const colorsMatch = (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  // Effect to update canvas properties based on state
  useEffect(() => {
    if (ctx.current) {
      ctx.current.globalCompositeOperation = activeTool === 'eraser' ? 'source-over' : 'source-over';
      ctx.current.strokeStyle = activeTool === 'eraser' ? backgroundColor : currentColor;
      ctx.current.lineWidth = thickness;
      ctx.current.globalAlpha = opacity / 100; // Set opacity
    }
  }, [currentColor, backgroundColor, thickness, activeTool, opacity]);

  return [
    { thickness, activeTool, currentColor, backgroundColor, opacity, pressureSensitivity },
    { initialize, handleColor, handleBackgroundColor, handleEraser, handleBrush, handleThickness, handleOpacity, handlePressureSensitivity, handleClean, handleFillTool, handleFillImage, handleFill, handleApplyTransformedImage, undo, redo }
  ];
};

export default usePaintCustomHook;
