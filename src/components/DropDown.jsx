import React, { useState } from 'react'
import DownArow from '../assets/images/icon-down-arrow.svg'
export const DropDown = ({options,SetOptions,isRunning}) => {
   const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]); 

  return (
    <div className="relative w-48 font-sora font-bold text-sm">
      

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 text-neutral-100 hover:text-white rounded-lg transition-colors border border-neutral-500"
        disabled={isRunning}
      >
        <span>{selected}</span>
        
  
        <img src={DownArow} alt="Down arow" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}  />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-neutral-800 rounded-lg shadow-xl overflow-hidden z-50 py-1">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
                SetOptions(option)
              }}
              className="flex items-center px-3 py-2 cursor-pointer text-neutral-100 hover:bg-neutral-500 group"
            >
              {/* --- THE CIRCLE LOGIC --- */}
              <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center
                ${selected === option ? 'border-blue-500 border-5' : 'border-neutral-100 group-hover:border-neutral-400'}`}
              >
              </div>
              
             
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
