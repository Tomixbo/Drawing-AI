import './App.css';
import axios from 'axios';
import SideToolBar from './components/SideToolBar';
import CanvasPreviews from './components/CanvasPreviews';
import TopToolBar from './components/TopToolBar';
import usePaintCustomHook from './paintCustomHook';
import { useEffect, useState, useCallback } from 'react';

function App() {
  const canvasWidth = 512;
  const canvasHeight = 512;
  const [{ canvasRef, activeTool, thickness, backgroundColor, currentColor }, { initialize, handleColor, handleBackgroundColor, handleBrush, handleEraser, handleThickness, handleClean, handleFillTool, handleFill, undo, redo }] = usePaintCustomHook(canvasWidth, canvasHeight);

  const [transformedImage, setTransformedImage] = useState(null);
  const [prompt, setPrompt] = useState('');

  const updateTransformedImage = useCallback(async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'canvas.png');
      formData.append('prompt', prompt); // Add prompt to FormData

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
  }, [canvasRef, prompt]);

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
    <div className='h-screen flex flex-col'>
      <TopToolBar handleThickness={handleThickness} handleClean={handleClean} transformedImage={transformedImage} prompt={prompt} setPrompt={setPrompt} thickness={thickness} undo={undo} redo={redo} />
      <div className='flex flex-1'>
        <SideToolBar
          handleColor={handleColor}
          handleBackgroundColor={handleBackgroundColor}
          handleBrush={handleBrush}
          handleEraser={handleEraser}
          handleFillTool={handleFillTool}
          activeTool={activeTool}
          currentColor={currentColor} // Pass the currentColor prop
          backgroundColor={backgroundColor} // Pass the backgroundColor prop
        />
        <div className='flex flex-1'>
          <CanvasPreviews
            canvasRef={canvasRef}
            initialize={initialize}
            handleFill={handleFill}
            activeTool={activeTool}
            thickness={thickness}
            width={canvasWidth}
            height={canvasHeight}
            border="1px solid #333333"
          />
          <div className='p-6 bg-neutral-700 shadow-inner flex flex-col flex-none items-center'>
            {transformedImage && <img src={transformedImage} alt='Transformed Canvas' className='bg-white' style={{ width: canvasWidth, height: canvasHeight }} />}
            <h2 className='text-lg text-white font-semibold mt-4'>Transformed Image (Grayscale)</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
