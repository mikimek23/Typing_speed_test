import React, { useState } from 'react'
import paragraphs from '../../data.json'
import { StartComp } from './StartComp'
export const Paragraphs = () => {
    const [showModal,setShowModal]=useState(true)
  return (
    <div className='text-white  w-full py-5 px-50 border text-justify'> 
        <p className='text-white'>
            {paragraphs.hard[9].text}
        </p>
        <StartComp
      isOpen={showModal} 
      onClose={()=>setShowModal(false)}
      onClick={()=>setShowModal(false)}
      >
       <div className="w-fit border p-0.5 rounded-lg border-blue-500">
        <button onClick={() => setShowModal(false)} className="block bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-lg">
          Start Typing Test
        </button>
       </div>
       <p className="font-bold">Or click the text and start typing</p>
        
      </StartComp>
        </div>
  )
}
