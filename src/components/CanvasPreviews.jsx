import React, { useEffect } from 'react';

export default function CanvasPreviews({ canvasRef, initialize, handleFill, activeTool, thickness, width, height, border }) {
  const wd = thickness;
  const wdHalf = wd ? wd / 2 : 0;

  const crosshairCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><line x1="10" y1="0" x2="10" y2="20" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1"/><line x1="0" y1="10" x2="20" y2="10" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1"/></svg>') 10 10, auto`;

  const cursor = wd < 5 ? crosshairCursor : `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${wd}" viewBox="0 0 ${wd} ${wd}" width="${wd}"><circle cx="${wdHalf}" cy="${wdHalf}" r="${wdHalf - 1}" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1.5" /></svg>') ${wdHalf} ${wdHalf}, auto`;

  const fillCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="rgba(255, 255, 255, 0.7)" d="M21,12.17V6c0-1.206-0.799-3-3-3s-3,1.794-3,3v2.021L10.054,13H6c-1.105,0-2,0.895-2,2v9h2v-7 l12,12l10-10L21,12.17z M18,5c0.806,0,0.988,0.55,1,1v4.17l-2-2V6.012C17.012,5.55,17.194,5,18,5z M18,26l-9-9l6-6v6h2v-6.001L25,19 L18,26z M4,26h2v2H4V26z"/></svg>') 5 25, auto`;


  const canvasCursor = activeTool === 'fill' ? fillCursor : cursor;

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCanvasClick = (e) => {
    if (activeTool !== 'fill') return;
    handleFill(e.clientX, e.clientY);
  };

  return (
    <section className='flex flex-1 p-6 w-full bg-neutral-800 shadow-inner'>
      <canvas
        className='bg-white'
        style={{ cursor: canvasCursor, border, width, height }}
        ref={canvasRef}
        onClick={handleCanvasClick}
      />
    </section>
  );
}
