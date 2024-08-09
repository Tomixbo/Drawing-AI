import './App.css';
import axios from 'axios';
import SideToolBar from './components/SideToolBar';
import CanvasPreviews from './components/CanvasPreviews';
import TopToolBar from './components/TopToolBar';
import AdvancedPanel from './components/AdvancedPanel';
import Loader from './components/Loader';
import usePaintCustomHook from './paintCustomHook';
import { useState, useCallback, useRef, useMemo } from 'react';

// Function debounce to limit API call frequency
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

function App() {
  const canvasWidth = 512;
  const canvasHeight = 512;
  const canvasRef = useRef(null);
  const [transformedImage, setTransformedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isAdvancedPanelVisible, setIsAdvancedPanelVisible] = useState(false); // State to manage the visibility of the Advanced Panel
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  // State for the advanced panel sliders
  const [guidanceScale, setGuidanceScale] = useState(0);
  const [inferenceSteps, setInferenceSteps] = useState(30);
  const [randomSeed, setRandomSeed] = useState(21);
  const [conditioningScale, setConditioningScale] = useState(0.5);
  const [guidanceStart, setGuidanceStart] = useState(0);
  const [guidanceEnd, setGuidanceEnd] = useState(0.7);

  // Memoize the settings object to prevent unnecessary re-renders
  const settings = useMemo(() => ({
    GUIDANCE_SCALE: guidanceScale,
    INFERENCE_STEPS: inferenceSteps,
    RANDOM_SEED: randomSeed,
    CONDITIONING_SCALE: conditioningScale,
    GUIDANCE_START: guidanceStart,
    GUIDANCE_END: guidanceEnd,
  }), [guidanceScale, inferenceSteps, randomSeed, conditioningScale, guidanceStart, guidanceEnd]);

  const debouncedUpdateTransformedImage = useRef(
    debounce(async (currentPrompt, updatedSettings) => {
      if (!canvasRef.current) return;

      setIsLoading(true); // Show loader when API call starts

      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'canvas.png');
        formData.append('prompt', currentPrompt || ''); // Ensure prompt is not undefined
        formData.append('settings', JSON.stringify(updatedSettings)); // Pass the settings as a JSON string

        try {
          const response = await axios.post('http://localhost:5000/transform', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setTransformedImage(response.data.image);
        } catch (error) {
          console.error('Error transforming image:', error);
        } finally {
          setIsLoading(false); // Hide loader when API call finishes
        }
      }, 'image/png');
    }, 1000)
  ).current;

  const handleSliderChange = (name, value) => {
    switch (name) {
      case 'GUIDANCE_SCALE':
        setGuidanceScale(value);
        break;
      case 'INFERENCE_STEPS':
        setInferenceSteps(value);
        break;
      case 'RANDOM_SEED':
        setRandomSeed(value);
        break;
      case 'CONDITIONING_SCALE':
        setConditioningScale(value);
        break;
      case 'GUIDANCE_START':
        setGuidanceStart(value);
        break;
      case 'GUIDANCE_END':
        setGuidanceEnd(value);
        break;
      default:
        break;
    }
    debouncedUpdateTransformedImage(prompt, {
      ...settings,
      [name]: value,
    });
  };

  const [{ activeTool, thickness, backgroundColor, currentColor, opacity, pressureSensitivity }, { initialize, handleColor, handleBackgroundColor, handleBrush, handleEraser, handleThickness, handleOpacity, handlePressureSensitivity, handleClean, handleFillTool, handleFillImage, handleFill, handleApplyTransformedImage, undo, redo }] = usePaintCustomHook(canvasWidth, canvasHeight, canvasRef, (currentPrompt) => debouncedUpdateTransformedImage(currentPrompt || prompt, settings));

  const handlePromptChange = useCallback((newPrompt) => {
    setPrompt(newPrompt);
    debouncedUpdateTransformedImage(newPrompt, settings);
  }, [debouncedUpdateTransformedImage, settings]);

  const toggleAdvancedPanel = () => {
    setIsAdvancedPanelVisible((prev) => !prev);
  };

  return (
    <div className='h-screen flex flex-col '>
      <TopToolBar 
        handleThickness={handleThickness} 
        handleOpacity={handleOpacity} 
        handleClean={handleClean} 
        transformedImage={transformedImage} 
        prompt={prompt} 
        setPrompt={handlePromptChange} 
        thickness={thickness} 
        opacity={opacity} 
        undo={undo} 
        redo={redo} 
        updateTransformedImage={debouncedUpdateTransformedImage}
        handleApplyTransformedImage={() => handleApplyTransformedImage(transformedImage)}
        handlePressureSensitivity={handlePressureSensitivity}
        pressureSensitivity={pressureSensitivity}
      />
      <div className='flex flex-1'>
        <SideToolBar
          handleColor={handleColor}
          handleBackgroundColor={handleBackgroundColor}
          handleBrush={handleBrush}
          handleEraser={handleEraser}
          handleFillTool={handleFillTool}
          handleFillImage={(img) => handleFillImage(img, prompt, settings)} // Pass prompt and settings
          activeTool={activeTool}
          currentColor={currentColor} // Pass the currentColor prop
          backgroundColor={backgroundColor} // Pass the backgroundColor prop
        />
        <div className='flex flex-1 flex-wrap '>
          <CanvasPreviews
            canvasRef={canvasRef}
            initialize={initialize}
            handleFill={(x, y) => handleFill(x, y, prompt, settings)} // Pass prompt and settings
            activeTool={activeTool}
            thickness={thickness}
            width={canvasWidth}
            height={canvasHeight}
            border="1px solid #333333"
          />
          <div className='p-6 bg-neutral-700 shadow-inner flex flex-col flex-none xl:items-center w-full xl:w-auto '>
            {transformedImage && <img src={transformedImage} alt='Transformed Canvas' className='bg-white' style={{ width: canvasWidth, height: canvasHeight }} />}
            <Loader isVisible={isLoading} /> {/* Display loader bar below the image */}
            <h2 className='text-lg text-white font-semibold mt-4 max-xl:ml-44'>Generated Image</h2>
            <button 
              onClick={toggleAdvancedPanel} 
              className="mt-4 px-4 py-1 bg-neutral-600 text-white text-sm rounded hover:bg-neutral-700"
            >
              {isAdvancedPanelVisible ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
            {isAdvancedPanelVisible && (
              <AdvancedPanel 
                guidanceScale={guidanceScale}
                inferenceSteps={inferenceSteps}
                randomSeed={randomSeed}
                conditioningScale={conditioningScale}
                guidanceStart={guidanceStart}
                guidanceEnd={guidanceEnd}
                onSliderChange={handleSliderChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
