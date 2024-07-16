import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TopToolBar({ handleThickness, handleClean }) {
  return (
    <header className='w-full px-3 py-2 flex bg-slate-100 shadow-sm z-10'>
      <div className='flex flex-none justify-start items-center space-x-3 ml-12'>
        <div className='flex items-center space-x-3 mr-3'>
          <p className='mr-3'>Brush Size</p>
          <input type='range' min={1} max={200} defaultValue={5} onChange={handleThickness} className='w-40' />
        </div>
        <div className='w-px h-full bg-gray-300 mx-5'></div>

        <button className='p-1 bg-slate-100 hover:bg-slate-200 flex items-center ml-16' onClick={handleClean}>
          <FontAwesomeIcon icon={faTrash} className="text-xl mx-1" />
        </button>
      </div>
      <div className='flex-1 flex justify-end items-center'>
        {/* Placeholder for the second column, add more tools or info here as needed */}
      </div>
    </header>
  );
}
