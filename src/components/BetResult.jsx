import React from 'react'
import Beat from '../assets/images/icon-new-pb.svg'
import Restart from '../assets/images/icon-restart.svg'
import Confetti from '../assets/images/pattern-confetti.svg'
export const BetResult = () => {
  return (
     <div className=" text-neutral-100 py-25 justify-items-center justify-center px-50 w-full">
            <div>
                 <img src={Beat} alt="Completed" className='border-none' />
            </div>
            <div className='m-4 justify-items-center'>
                <h2 className='text-neutral-100 font-bold text-2xl'>High Score Smashed!</h2>
                <p className='text-neutral-500 text-[0.75em]'>You're getting faster. That was incredible typing</p>
            </div>
    
            <div className='flex w-fit flex-1 p-5'>
                <div className='border w-30 m-2 p-2 border-neutral-500 rounded-lg '>
                    <span className='text-neutral-500'>WPM:</span>
                    <p className='font-bold'>95</p>
                </div>
    
                <div className='border w-30 m-2 p-2 border-neutral-500 rounded-lg '>
                    <span className='text-neutral-500'>Accuracy:</span>
                    <p className='font-bold text-red-500'>100%</p>
                </div>
    
                <div className='border w-30 m-2 p-2 border-neutral-500 rounded-lg '>
                    <span className='text-neutral-500'>Characters:</span>
                    <p className='font-bold text-neutral-100'><span className='text-green-500'>120</span>/<span className='text-red-500'>5</span></p>
                </div>
            </div>
             <div className='m-10'>
                    <button className='block border p-2 rounded-lg bg-neutral-100 text-neutral-900 font-bold'>Beat This Score <span className='text-neutral-500'><img src={Restart} alt=" restart" className='inline filter invert sepia saturate-200 hue-rotate-180 p-0.5'/></span> </button>
                </div>
                <div><img src={Confetti} alt="confetti" className=' m-0 p-0  w-full fixed left-0 bottom-0'/></div>
        </div>
  )
}
