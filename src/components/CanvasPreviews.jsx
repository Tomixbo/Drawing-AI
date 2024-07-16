import React, { useEffect } from 'react';

export default function CanvasPreviews({ canvasRef, initialize, handleFill, activeTool, thickness, width, height, border }) {
  const wd = thickness;
  const wdHalf = wd ? wd / 2 : 0;
  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${wd}" viewBox="0 0 ${wd} ${wd}" width="${wd}"><circle cx="${wdHalf}" cy="${wdHalf}" r="${wdHalf}" fill="%23000000" /></svg>') ${wdHalf} ${wdHalf}, auto`;

  useEffect(() => {
    initialize();
  }, [initialize]); // Ensure initialize is in the dependency array

  const handleCanvasClick = (e) => {
    if (activeTool !== 'fill') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleFill(x, y);
  };

  return (
    <section className='p-6 w-full h-full bg-slate-100 shadow-inner'>
      <canvas
        className='bg-white'
        style={{ cursor, border, width, height }}
        ref={canvasRef}
        onClick={handleCanvasClick}
      />
    </section>
  );
}
