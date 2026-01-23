import React from 'react'
import Restart from '../assets/images/icon-restart.svg'

const Displaytext = ({ text, typed, showMode, setShowMode, setIsRunning, inputRef, handleChange, onRestart }) => {
  return (
    <div className='relative h-[calc(100hv-40px)]'>
      <div className='w-full fixed top-60 md:top-54 lg:top-39 h-screen inset-0 overflow-hidden justify-items-center content-center backdrop-blur-xs box-border' 
        onClick={() => {
          setShowMode(true)
          setIsRunning(true)
          inputRef.current?.focus()
        }}
        hidden={showMode}>
        <div className="w-fit border p-0.5 rounded-lg border-blue-500 hover:border-hidden">
          <button
            onClick={() => {
              setShowMode(true)
              setIsRunning(true)
              inputRef.current?.focus()
            }}
            className="block bg-blue-500 hover:bg-blue-400  px-3 py-2 rounded-lg">
            Start Typing Test
          </button>
        </div>
        <p className="font-bold">Or click the text and start typing</p>
      </div>

      <p className='text-neutral-400 cursor-text text-3xl py-5 text-left'>
        {text.split('').map((char, index) => {
          let className = ''
          if (index < typed.length) {
            className =
              char === typed[index]
                ? "text-green-500"
                : "text-red-500 underline"
          }
          if (index === typed.length) {
            className = 'bg-neutral-500 '
          }
          return (
            <span key={index} className={className}>{char}</span>
          )
        })}
      </p>
      <hr className='mt-2 w-full text-neutral-600'/>
      <div className='m-5 justify-items-center'>
        <button onClick={() => onRestart?.()} className='block  p-2 rounded-lg bg-neutral-800 text-neutral-100 font-bold' hidden={!showMode}>Restart Test<span className='text-neutral-500'><img src={Restart} alt=" restart" className=' inline filter  sepia saturate-200 hue-rotate-180 p-1'/></span> </button>
      </div>
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        autoFocus
        className="absolute opacity-0 resize-none pointer-events-none"
        rows={4}
      />
    </div>
  )
}

export default Displaytext
