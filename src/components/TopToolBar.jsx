import React, { useState } from 'react';
import { faTrash, faDownload, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import piexif from 'piexifjs';

export default function TopToolBar({ handleThickness, handleClean, transformedImage, prompt, setPrompt, thickness, undo, redo }) {
  const [inputValue, setInputValue] = useState(`${thickness} px`);

  // const handleSaveImage = () => {
  //   if (!transformedImage) return;
  //   const link = document.createElement('a');
  //   link.href = transformedImage;
  //   link.download = 'transformed-image.png';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleSaveImage = () => {
    if (!transformedImage) return;

    const img = new Image();
    img.src = transformedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryData = reader.result.split(',')[1];
          const exifObj = { "0th": {}, "Exif": {}, "GPS": {}, "Interop": {}, "1st": {}, "thumbnail": null };
          exifObj["0th"][piexif.ImageIFD.ImageDescription] = prompt;

          const exifBytes = piexif.dump(exifObj);
          const newDataUrl = piexif.insert(exifBytes, `data:image/jpeg;base64,${binaryData}`);

          const link = document.createElement('a');
          link.href = newDataUrl;
          link.download = 'transformed-image.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg');
    };
  };

  const handleSliderChange = (e) => {
    const value = e.target.value;
    handleThickness(value);
    setInputValue(`${value} px`);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const validateAndFormatInput = (value) => {
    const numValue = parseInt(value.replace(' px', ''), 10);
    if (!isNaN(numValue)) {
      const newValue = numValue > 128 ? 128 : numValue;
      handleThickness(newValue);
      setInputValue(`${newValue} px`);
    } else {
      setInputValue(`${thickness} px`);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndFormatInput(e.target.value);
    }
  };

  const handleInputBlur = (e) => {
    validateAndFormatInput(e.target.value);
  };

  return (
    <header className='border-2 border-neutral-700 w-full px-1.5 py-1 flex bg-neutral-600 shadow-sm z-10 '>
      <div className='flex flex-none justify-start items-center'>
        <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="logo" className="App-logo w-6" />

        <div className='w-px h-full bg-neutral-700 ' style={{ marginLeft: '6px' }}></div>
        <div className='w-px h-full bg-neutral-700 ' style={{ marginLeft: '2px' }}></div>

        <div className='flex items-center px-2 space-x-1'>
          <button className='px-1 bg-neutral-600 hover:bg-neutral-700 flex items-center' onClick={undo}>
            <FontAwesomeIcon icon={faUndo} className="text-xl mx-1 text-white" />
          </button>
          <button className='px-1 bg-neutral-600 hover:bg-neutral-700 flex items-center' onClick={redo}>
            <FontAwesomeIcon icon={faRedo} className="text-xl mx-1 text-white" />
          </button>
        </div>

        <div className='w-px h-full bg-neutral-700 mx-1'></div>

        <div className='flex items-center px-2 space-x-3'>
          <p className='text-white text-xs'>Brush size :</p>
          <input type='range' min={1} max={128} value={thickness} onChange={handleSliderChange} className='w-40' />
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            onBlur={handleInputBlur}
            className='p-1 bg-neutral-500 text-white text-xs border-none rounded focus:outline-none w-12'
          />
        </div>

        <div className='w-px h-full bg-neutral-700 mx-1'></div>

        <button className='p-1 bg-neutral-600 hover:bg-neutral-700 flex items-center' onClick={handleClean}>
          <FontAwesomeIcon icon={faTrash} className="text-xl mx-1 text-white" />
        </button>
        <div className='w-px h-full bg-neutral-700 mx-1'></div>
      </div>

      <div className='flex-1 flex justify-end items-center'>
        <div className='w-px h-full bg-neutral-700 mx-1'></div>
        <button className='p-1 bg-neutral-600 hover:bg-neutral-700 flex items-center' onClick={handleSaveImage}>
          <FontAwesomeIcon icon={faDownload} className="text-xl mx-1 text-white" />
        </button>

        <div className='w-px h-full bg-neutral-700 mx-1'></div>
        <div className='flex items-center space-x-3 w-full max-w-md mx-2'>
          <p className='text-white text-xs'>Prompt:</p>
          <input
            type='text'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className='p-1 bg-neutral-500 text-white text-xs border-none rounded w-full focus:outline-none'
          />
        </div>
      </div>
    </header>
  );
}
