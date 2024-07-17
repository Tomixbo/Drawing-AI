import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TopToolBar({ handleThickness, handleClean }) {
  return (
    <header className='border-2 border-neutral-800 w-full px-3 py-2 flex bg-neutral-700 shadow-sm z-10 '>
      <div className='flex flex-none justify-start items-center space-x-3 ml-12'>
        <div className='flex items-center space-x-3 mr-3'>
          <p className='mr-3 text-white'>Brush Size</p>
          <input type='range' min={1} max={200} defaultValue={5} onChange={handleThickness} className='w-40' />
        </div>
        <div className='w-px h-full bg-neutral-800 mx-5'></div>

        <button className='p-1 bg-neutral-700 hover:bg-neutral-800 flex items-center ml-16' onClick={handleClean}>
          <FontAwesomeIcon icon={faTrash} className="text-xl mx-1 text-white" />
        </button>
      </div>
      <div className='flex-1 flex justify-end items-center'>
        <div className='w-px h-full bg-neutral-800 mx-5'></div>
        <p className='text-white'>Tools for the transformed image canvas</p>
      </div>
    </header>
  );
}
