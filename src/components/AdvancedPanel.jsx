import React from 'react';

export default function AdvancedPanel({
  guidanceScale,
  inferenceSteps,
  strength,
  randomSeed,
  conditioningScale,
  guidanceStart,
  guidanceEnd,
  onSliderChange
}) {
  return (
    <div className='mt-4 p-3 bg-neutral-800 rounded shadow-md'>
      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label className='text-white text-xs'>Guidance Scale:</label>
          <input
            type='range'
            min={0}
            max={7.5}
            step={0.1}
            value={guidanceScale}
            onChange={(e) => onSliderChange('GUIDANCE_SCALE', parseFloat(e.target.value))}
            className='w-full'
          />
          <input
            type='number'
            min={0}
            max={20}
            step={0.1}
            value={guidanceScale}
            onChange={(e) => onSliderChange('GUIDANCE_SCALE', parseFloat(e.target.value))}
            className='w-full mt-1 p-1 bg-neutral-700 text-white rounded text-xs'
          />
        </div>
        <div>
          <label className='text-white text-xs'>Inference Steps:</label>
          <input
            type='range'
            min={1}
            max={100}
            step={1}
            value={inferenceSteps}
            onChange={(e) => onSliderChange('INFERENCE_STEPS', parseInt(e.target.value, 10))}
            className='w-full'
          />
          <input
            type='number'
            min={1}
            max={100}
            step={1}
            value={inferenceSteps}
            onChange={(e) => onSliderChange('INFERENCE_STEPS', parseInt(e.target.value, 10))}
            className='w-full mt-1 p-1 bg-neutral-700 text-white rounded text-xs'
          />
        </div>
        <div>
          <label className='text-white text-xs'>Random Seed:</label>
          <input
            type='range'
            min={0}
            max={100}
            step={1}
            value={randomSeed}
            onChange={(e) => onSliderChange('RANDOM_SEED', parseInt(e.target.value, 10))}
            className='w-full'
          />
          <input
            type='number'
            min={0}
            max={100}
            step={1}
            value={randomSeed}
            onChange={(e) => onSliderChange('RANDOM_SEED', parseInt(e.target.value, 10))}
            className='w-full mt-1 p-1 bg-neutral-700 text-white rounded text-xs'
          />
        </div>
        <div>
          <label className='text-white text-xs'>Conditioning Scale:</label>
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={conditioningScale}
            onChange={(e) => onSliderChange('CONDITIONING_SCALE', parseFloat(e.target.value))}
            className='w-full'
          />
          <input
            type='number'
            min={0}
            max={1}
            step={0.01}
            value={conditioningScale}
            onChange={(e) => onSliderChange('CONDITIONING_SCALE', parseFloat(e.target.value))}
            className='w-full mt-1 p-1 bg-neutral-700 text-white rounded text-xs'
          />
        </div>
        <div>
          <label className='text-white text-xs'>Guidance Start:</label>
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={guidanceStart}
            onChange={(e) => onSliderChange('GUIDANCE_START', parseFloat(e.target.value))}
            className='w-full'
          />
          <input
            type='number'
            min={0}
            max={1}
            step={0.01}
            value={guidanceStart}
            onChange={(e) => onSliderChange('GUIDANCE_START', parseFloat(e.target.value))}
            className='w-full mt-1 p-1 bg-neutral-700 text-white rounded text-xs'
          />
        </div>
        <div>
          <label className='text-white text-xs'>Guidance End:</label>
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={guidanceEnd}
            onChange={(e) => onSliderChange('GUIDANCE_END', parseFloat(e.target.value))}
            className='w-full'
          />
          <input
            type='number'
            min={0}
            max={1}
            step={0.01}
            value={guidanceEnd}
            onChange={(e) => onSliderChange('GUIDANCE_END', parseFloat(e.target.value))}
            className='w-full mt-1 p-1 bg-neutral-700 text-white rounded text-xs'
          />
        </div>
      </div>
    </div>
  );
}
