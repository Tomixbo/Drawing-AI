import React from 'react';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'; // Import download icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TopToolBar({ handleThickness, handleClean, transformedImage, prompt, setPrompt }) {
  const handleSaveImage = () => {
    if (!transformedImage) return;
    const link = document.createElement('a');
    link.href = transformedImage;
    link.download = 'transformed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className='border-2 border-neutral-700 w-full px-1.5 py-1 flex bg-neutral-600 shadow-sm z-10 '>
      <div className='flex flex-none justify-start items-center'>
        <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="logo" className="App-logo w-6" />
        <div className='w-px h-full bg-neutral-700 ' style={{ marginLeft: '6px'}}></div>
        <div className='w-px h-full bg-neutral-700 ' style={{ marginLeft: '2px'}}></div>

        <div className='flex items-center ml-6 mr-3 space-x-3'>
          <p className='text-white text-xs'>Brush size :</p>
          <input type='range' min={1} max={100} defaultValue={5} onChange={handleThickness} className='w-40' />
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
        <div className='flex items-center space-x-3 w-full max-w-lg mx-2'>
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
