import './App.css';
import axios from 'axios';
import SideToolBar from './components/SideToolBar';
import CanvasPreviews from './components/CanvasPreviews';
import TopToolBar from './components/TopToolBar';
import usePaintCustomHook from './paintCustomHook';
import { useState, useCallback, useRef } from 'react';

function App() {
  const canvasWidth = 512;
  const canvasHeight = 512;
  const canvasRef = useRef(null);
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
  }, [prompt]);

  const [{ activeTool, thickness, backgroundColor, currentColor }, { initialize, handleColor, handleBackgroundColor, handleBrush, handleEraser, handleThickness, handleClean, handleFillTool, handleFillImage, handleFill, undo, redo }] = usePaintCustomHook(canvasWidth, canvasHeight, canvasRef, updateTransformedImage);



  const handlePromptChange = useCallback((newPrompt) => {
    setPrompt(newPrompt);
    updateTransformedImage();
  }, [updateTransformedImage]);

  return (
    <div className='h-screen flex flex-col'>
      <TopToolBar 
        handleThickness={handleThickness} 
        handleClean={handleClean} 
        transformedImage={transformedImage} 
        prompt={prompt} 
        setPrompt={handlePromptChange} 
        thickness={thickness} 
        undo={undo} 
        redo={redo} 
        updateTransformedImage={updateTransformedImage}
      />
      <div className='flex flex-1'>
        <SideToolBar
          handleColor={handleColor}
          handleBackgroundColor={handleBackgroundColor}
          handleBrush={handleBrush}
          handleEraser={handleEraser}
          handleFillTool={handleFillTool}
          handleFillImage={handleFillImage}
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
            <h2 className='text-lg text-white font-semibold mt-4'>Generated Image</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
