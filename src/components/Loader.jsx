// Loader.jsx
import React from 'react';

export default function Loader({ isVisible }) {
  return (
    <div className="w-full h-2 bg-neutral-600 rounded mt-4">
      <div
        className={`loader-bar h-full bg-blue-500 rounded`}
        style={{
          visibility: isVisible ? 'visible' : 'hidden',
        }}
      ></div>
    </div>
  );
}
