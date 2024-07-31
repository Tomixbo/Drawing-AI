import React, { useState, useRef } from 'react';
import { faEraser, faPaintBrush, faFillDrip, faChevronRight, faChevronLeft, faArrowsRotate, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideToolBar({
  handleColor,
  handleBackgroundColor,
  handleBrush,
  handleEraser,
  handleFillTool,
  handleFillImage,
  activeTool,
  currentColor,
  backgroundColor
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const fileInputRef = useRef(null); // Référence pour l'élément de saisie de fichier

  const toggleSidebar = () => {
    setIsMaximized(!isMaximized);
  };

  const flipColors = () => {
    const temp = currentColor;
    handleColor({ currentTarget: { value: backgroundColor } });
    handleBackgroundColor({ currentTarget: { value: temp } });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => handleFillImage(img);
      img.src = event.target.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className={`p-0.5 shadow-lg flex flex-col ${isMaximized ? 'items-start' : 'items-center'} bg-neutral-600 z-20 border-2 border-neutral-700 ${isMaximized ? 'w-auto' : 'w-10'} `}>
      <button onClick={toggleSidebar} className={`p-1 bg-neutral-600 hover:bg-neutral-700 my-1 ${isMaximized ? 'self-end' : ''}`}>
        <FontAwesomeIcon icon={isMaximized ? faChevronLeft : faChevronRight} className="text-xl text-white" />
      </button>

      <div className='w-full h-px bg-neutral-700 my-4'></div>

      <div className='flex flex-col items-start space-y-3 w-full'>
        <button className={`h-8 p-1 flex items-center ${activeTool === 'brush' ? 'bg-neutral-700' : 'bg-neutral-600'} hover:bg-neutral-700 w-full`} onClick={handleBrush}>
          <FontAwesomeIcon icon={faPaintBrush} className="text-xl text-white" />
          {isMaximized && <span className='mx-2 text-white'>Brush</span>}
        </button>

        <button className={`h-8 p-1 flex items-center ${activeTool === 'eraser' ? 'bg-neutral-700' : 'bg-neutral-600'} hover:bg-neutral-700 w-full`} onClick={handleEraser}>
          <FontAwesomeIcon icon={faEraser} className="text-xl text-white" />
          {isMaximized && <span className='mx-2 text-white'>Eraser</span>}
        </button>

        <button className={`h-8 p-1 flex items-center ${activeTool === 'fill' ? 'bg-neutral-700' : 'bg-neutral-600'} hover:bg-neutral-700 w-full`} onClick={handleFillTool}>
          <FontAwesomeIcon icon={faFillDrip} className="text-xl text-white" />
          {isMaximized && <span className='mx-2 text-white'>Fill</span>}
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden-file-input" // Utiliser la classe CSS pour cacher le bouton
          ref={fileInputRef} // Assigner la référence
          onChange={handleImageUpload}
        />
        <button className={`h-8 p-1.5 flex items-center bg-neutral-600 hover:bg-neutral-700 w-full`} onClick={() => fileInputRef.current.click()}>
          <FontAwesomeIcon icon={faImage} className="text-xl text-white" />
          {isMaximized && <span className='mx-2 text-white'>Fill Image</span>}
        </button>
      </div>

      <div className='w-full h-px bg-neutral-700 my-4'></div>

      <div className={`relative flex justify-center w-full`}>
        <div className={`relative ${isMaximized ? 'w-16 h-16' : 'w-8 h-8'}`}>
          <input
            type="color"
            className="hidden-color-input"
            onChange={handleColor}
          />
          <button
            className={`primary-color-button cursor-pointer absolute w-full h-full border-2 border-white shadow-sm top-0 left-0`}
            onClick={(e) => e.target.previousSibling.click()}
            style={{ backgroundColor: currentColor }}
          />

          <button
            className="flip-color-button"
            onClick={flipColors}
          >
            <FontAwesomeIcon icon={faArrowsRotate} className={`text-white ${isMaximized ? 'w-5' : 'w-2'}`} />
          </button>

          <input
            type="color"
            className="hidden-color-input"
            value={backgroundColor}
            onChange={handleBackgroundColor}
          />
          <button
            className={`background-color-button cursor-pointer absolute w-full h-full border-2 border-white shadow-sm bottom-0 right-0`}
            onClick={(e) => e.target.previousSibling.click()}
            style={{ backgroundColor: backgroundColor }}
          />
        </div>
      </div>
    </aside>
  );
}
