import React from 'react'
import Right from '../assets/images/icon-completed.svg'
import Restart from '../assets/images/icon-restart.svg'
import Stara from '../assets/images/pattern-star-1.svg'
import Starb from '../assets/images/pattern-star-2.svg'

export const Results = () => {
  return (
    <div className="text-neutral-100 py-25 justify-items-center justify-center px-50 w-full">
        <div><img src={Stara} alt="star" className='block absolute  top-100 right-50' /></div>
        <div><img src={Starb} alt="" className='block absolute  top-50 left-50'/></div>
        <div>
            <span className=' block p-2 rounded-full  bg-[#73ff001f]'>
                <span className=' block p-2 rounded-full  bg-[#00800075]'>
                    <img src={Right} alt="Completed" className='border-none' />
                </span>
                </span>
        </div>
        <div className='m-4 justify-items-center'>
            <h2 className='text-neutral-100 font-bold text-2xl'>Test Complete!</h2>
            <p className='text-neutral-500 text-[0.75em]'>Solid run. keep pushing to beat your high score.</p>
        </div>

        <div className='flex w-fit flex-1 p-5'>
            <div className='border w-30 m-2 p-2 border-neutral-500 rounded-lg '>
                <span className='text-neutral-500'>WPM:</span>
                <p className='font-bold'>85</p>
            </div>

            <div className='border w-30 m-2 p-2 border-neutral-500 rounded-lg '>
                <span className='text-neutral-500'>Accuracy:</span>
                <p className='font-bold text-red-500'>90%</p>
            </div>

            <div className='border w-30 m-2 p-2 border-neutral-500 rounded-lg '>
                <span className='text-neutral-500'>Characters:</span>
                <p className='font-bold'><span className='text-green-500'>120</span>/<span className='text-red-500'>5</span></p>
            </div>
        </div>
         <div className='m-10'>
                <button className='block border p-2 rounded-lg bg-neutral-100 text-neutral-900 font-bold'>Go Again <span className='text-neutral-500'><img src={Restart} alt=" restart" className='inline filter invert sepia saturate-200 hue-rotate-180 p-0.5'/></span> </button>
            </div>
    </div>
  )
}
