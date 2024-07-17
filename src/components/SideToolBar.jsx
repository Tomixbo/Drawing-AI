import React from 'react';
import { faEraser, faPaintBrush, faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideToolBar({
  handleColor,
  handleBrush,
  handleEraser,
  handleFillTool,
  activeTool
}) {
  return (
    <aside className='p-1 shadow-lg flex flex-col items-center w-10 bg-neutral-600 z-20 border-2 border-neutral-700'>
      
      <div className='flex flex-col items-center space-y-3 mt-3'>
        

        <button className={`p-1 ${activeTool === 'brush' ? 'bg-neutral-700' : 'bg-neutral-600'} hover:bg-neutral-700 `} onClick={handleBrush}>
          <FontAwesomeIcon icon={faPaintBrush} className="text-xl text-white" />
        </button>

        <button className={`p-1 flex items-center ${activeTool === 'eraser' ? 'bg-neutral-700' : 'bg-neutral-600'} hover:bg-neutral-700 `} onClick={handleEraser}>
          <FontAwesomeIcon icon={faEraser} className="text-xl text-white" />
        </button>

        <button className={`p-1 ${activeTool === 'fill' ? 'bg-neutral-700' : 'bg-neutral-600'} hover:bg-neutral-700`} onClick={handleFillTool}>
          <FontAwesomeIcon icon={faFillDrip} className="text-xl text-white" />
        </button>
      </div>

      <div className='w-full h-px bg-neutral-700 my-4'></div>

      <input type='color' className='w-6 h-6 cursor-pointer border-2 border-white shadow-sm' onChange={handleColor} />
    </aside>
  );
}
