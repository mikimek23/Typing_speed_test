import React, { useEffect, useState } from 'react'

export const StatusMode = () => {
         const [isStatus,setIsStatus]=useState('');
    const [isMode,setIsMode]=useState('');
   // const [isTimed,setIsTimed]=useState(false)
   // const [countUp,setCountUp]=useState(1)
    const [countDown,setCountDown]=useState(60)
    const Difficulty=["Easy","Medium", "Hard"]
    const mode=["Timed(60s)","Passage"]
    useEffect(()=>{
        const interval=setInterval(()=>{
            
                setCountDown((prev)=>(prev>0?prev-1:0))
            
            // setCountUp((prev)=>prev+1)
        },1000)
        return ()=>clearInterval(interval)
    },[])
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
               <div>
                
                <span className='text-neutral-400 px-1'>Time:</span>
                <span className='font-bold font-sora'>{countDown}</span>
               </div>
            </div>
            {/**modes */}
            <div className='flex justify-between w-1/2  pl-40'>
                <div className="flex gap-2">
                    <span className='text-neutral-400 px-1'>Difficulty:</span>
                    {Difficulty.map((dif)=>(
                        <button 
                        key={dif}
                        onClick={()=>setIsStatus(dif)}
                        className={`block border rounded-lg hover:scale-105 focus:outline-2 focus:outline-blue-400 active active:scale-95 transition-all px-1 ${
                           isStatus===dif?'text-blue-400 border-blue-400':'' }`}
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
    </div>
  )
}
