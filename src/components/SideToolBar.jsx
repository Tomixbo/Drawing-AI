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
    <aside className='p-1 h-full shadow-lg flex flex-col items-center w-12 bg-slate-100 z-20'>
      <div className='flex flex-col items-center space-y-3 mt-6'>
        <button className={`p-1 ${activeTool === 'brush' ? 'bg-slate-300' : 'bg-slate-100'} hover:bg-slate-200 `} onClick={handleBrush}>
          <FontAwesomeIcon icon={faPaintBrush} className="text-xl" />
        </button>

        <button className={`p-1 flex items-center ${activeTool === 'eraser' ? 'bg-slate-300' : 'bg-slate-100'} hover:bg-slate-200 `} onClick={handleEraser}>
          <FontAwesomeIcon icon={faEraser} className="text-xl" />
        </button>

        <button className={`p-1 ${activeTool === 'fill' ? 'bg-slate-300' : 'bg-slate-100'} hover:bg-slate-200`} onClick={handleFillTool}>
          <FontAwesomeIcon icon={faFillDrip} className="text-xl" />
        </button>
      </div>

      <div className='w-full h-px bg-gray-300 my-3'></div>

      <input type='color' className='w-6 h-6 cursor-pointer border-2 border-white shadow-sm' onChange={handleColor} />
    </aside>
  );
}
