import './App.css';
import axios from 'axios';
import SideToolBar from './components/SideToolBar';
import CanvasPreviews from './components/CanvasPreviews';
import TopToolBar from './components/TopToolBar';
import usePaintCustomHook from './paintCustomHook';
import { useEffect, useState, useCallback } from 'react';

function App() {
  const canvasWidth = 600;
  const canvasHeight = 600;
  const [{ canvasRef, activeTool, thickness }, { initialize, handleColor, handleEraser, handleBrush, handleThickness, handleClean, handleFillTool, handleFill }] = usePaintCustomHook(canvasWidth, canvasHeight);

  const [transformedImage, setTransformedImage] = useState(null);

  const updateTransformedImage = useCallback(async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'canvas.png');

      try {
        const response = await axios.post('http://localhost:5000/transform', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setTransformedImage(response.data.image);
      } catch (error) {
        console.error('Error transforming image:', error);
      }
    }, 'image/png');
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const handleCanvasChange = () => {
        updateTransformedImage();
      };
      // Attach the event listener
      canvas.addEventListener('mouseup', handleCanvasChange);
      canvas.addEventListener('mouseout', handleCanvasChange);

      return () => {
        // Clean up the event listener
        canvas.removeEventListener('mouseup', handleCanvasChange);
        canvas.removeEventListener('mouseout', handleCanvasChange);
      };
    }
  }, [canvasRef, updateTransformedImage]);

  return (
    <div className='h-screen flex'>
      <SideToolBar
        handleColor={handleColor}
        handleBrush={handleBrush}
        handleEraser={handleEraser}
        handleFillTool={handleFillTool}
        activeTool={activeTool}
      />
      <div className='flex flex-col flex-1'>
        <TopToolBar handleThickness={handleThickness} handleClean={handleClean} />
        <div className='flex flex-1'>
          <CanvasPreviews
            canvasRef={canvasRef}
            initialize={initialize}
            handleFill={handleFill}
            activeTool={activeTool}
            thickness={thickness}
            width={canvasWidth}
            height={canvasHeight}
            border="1px solid #e2e8f0"
          />
          <div className='p-6 w-1/2 h-full bg-slate-200 shadow-inner'>
            {transformedImage && <img src={transformedImage} alt='Transformed Canvas' className='bg-white' style={{ width: canvasWidth, height: canvasHeight }} />}
            <h2 className='text-lg font-semibold mt-4'>Transformed Image (Grayscale)</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
