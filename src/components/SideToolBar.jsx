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
    <aside className='p-1 h-full shadow-lg flex flex-col items-center w-12 bg-neutral-700 z-20 border-2 border-neutral-800'>
      <div className='w-full h-px bg-neutral-800 mt-10 mb-4'></div>
      <div className='flex flex-col items-center space-y-3'>
        <button className={`p-1 ${activeTool === 'brush' ? 'bg-neutral-800' : 'bg-neutral-700'} hover:bg-neutral-800 `} onClick={handleBrush}>
          <FontAwesomeIcon icon={faPaintBrush} className="text-xl text-white" />
        </button>

        <button className={`p-1 flex items-center ${activeTool === 'eraser' ? 'bg-neutral-800' : 'bg-neutral-700'} hover:bg-neutral-800 `} onClick={handleEraser}>
          <FontAwesomeIcon icon={faEraser} className="text-xl text-white" />
        </button>

        <button className={`p-1 ${activeTool === 'fill' ? 'bg-neutral-800' : 'bg-neutral-700'} hover:bg-neutral-800`} onClick={handleFillTool}>
          <FontAwesomeIcon icon={faFillDrip} className="text-xl text-white" />
        </button>
      </div>

      <div className='w-full h-px bg-neutral-800 my-4'></div>

      <input type='color' className='w-6 h-6 cursor-pointer border-2 border-white shadow-sm' onChange={handleColor} />
    </aside>
  );
}
