import React, { useEffect } from 'react';

export default function CanvasPreviews({ canvasRef, initialize, handleFill, activeTool, thickness, width, height, border }) {
  const wd = thickness;
  const wdHalf = wd ? wd / 2 : 0;
  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${wd}" viewBox="0 0 ${wd} ${wd}" width="${wd}"><circle cx="${wdHalf}" cy="${wdHalf}" r="${wdHalf - 1}" fill="none" stroke="%23ffffff" stroke-width="1.5" /></svg>') ${wdHalf} ${wdHalf}, auto`;

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCanvasClick = (e) => {
    if (activeTool !== 'fill') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleFill(x, y);
  };

  return (
    <section className='flex flex-1 p-6 w-full bg-neutral-800 shadow-inner'>
      <canvas
        className='bg-white'
        style={{ cursor, border, width, height }}
        ref={canvasRef}
        onClick={handleCanvasClick}
      />
    </section>
  );
}
