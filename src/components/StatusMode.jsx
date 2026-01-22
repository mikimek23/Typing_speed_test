import React, { useEffect, useState } from 'react'
import Paragraphs  from '../../data.json';
import { Timer } from './Timer';


export const StatusMode = () => {
    const [isMode,setIsMode]=useState('Timed(60s)');
    const [difficulty,setDifficulty]=useState('Easy')
    const [typed, setTyped]=useState('')
    const [text,setText]=useState('')
    const [isRunning,setIsRunning]=useState(false)
    const Difficulty=["Easy","Medium", "Hard"]
    const mode=["Timed(60s)","Passage"]

    const generateText=(diff)=>{
       const key = diff || 'Easy'
    const list = Paragraphs[key] || []
    if (!Array.isArray(list) || list.length === 0) return ''
    const index = Math.floor(Math.random() * list.length)
    const item = list[index]
    return (item && (item.text || item)) || ''

    }
    console.log(difficulty)
    useEffect(()=>{
        setText(generateText(difficulty))
    },[difficulty])
    
    const handleChange=(e)=>{
        const value= e.target.value
        setTyped(value)
    }
  return (
    <div className='text-white  w-full py-5 px-50'>

        {/* status info  and mode*/}
        <div className='flex justify-between mt-20'>
            {/* status */}
            <div className='flex justify-between w-1/2 pr-40'>
               <div>
                <span className='text-neutral-400 px-1'>WPM:</span>
                <span className='font-bold'>32</span>
               </div>

               <div className="border-l border-neutral-800 h-5 mx-4"></div>

               <div>
                <span className='text-neutral-400 px-1'>Accuracy:</span>
                <span className='font-bold'>100%</span>
               </div>
               <div className="border-l border-neutral-800 h-5 mx-4"></div>

               <div className='flex'>
                <span className='text-neutral-400 px-1'>Time:</span>
                <span className='font-bold font-sora'>{<Timer isrunning={isRunning}/>}</span>
               </div>
            </div>
            {/**modes */}
            <div className='flex justify-between w-1/2  pl-40'>
                <div className="flex gap-2">
                    <span className='text-neutral-400 px-1'>Difficulty:</span>
                    {Difficulty.map((dif)=>(
                        <button 
                        key={dif}
                        onClick={()=>{
                            setDifficulty(dif)
                        }}
                        className={`block border rounded-lg hover:scale-105 focus:outline-2 focus:outline-blue-400 active active:scale-95 transition-all px-1 ${
                           difficulty===dif?'text-blue-400 border-blue-400':'' }`}
                        >{dif}</button>
                    ))}
                </div>

                <div className="border-l border-neutral-800 h-5 mx-4"></div>

                <div className="flex gap-2">
                    <span className='text-neutral-400 px-1'>Mode:</span>
                   {mode.map((mo)=>(
                        <button 
                        key={mo}
                        onClick={()=>{
                            setIsMode(mo)
                        }}
                        className={`block border rounded-lg hover:scale-105 focus:outline-2 focus:outline-blue-400 active active:scale-95 transition-all px-1 ${
                           isMode===mo?'text-blue-400 border-blue-400':'' }`}
                        >{mo}</button>
                    ))}
                </div>
            </div>
        </div>
        <hr className='mt-2 text-neutral-500'/>
       <p className='text-white cursor-text' >
        {text}
      </p>
       <hr className='mt-2 text-neutral-500'/>
      <textarea
        value={typed}
        onChange={handleChange}
        onClick={()=>setIsRunning(true)}
        placeholder='Click Start to begin typing or click the text' 
        className="w-full mt-3 p-2 rounded bg-neutral-900 text-white"
        rows={4}
      />
    </div>
  )
}
