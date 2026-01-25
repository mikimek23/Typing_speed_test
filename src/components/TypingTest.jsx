import React, { useEffect, useRef, useState } from 'react'
import Paragraphs  from '../../data.json';
import { Timer } from './Timer';
import Displaytext from './Displaytext'
import { DropDown } from './DropDown';


export const TypingTest = ({setSpeed,setFinalAccuracy,setFinalCorrect, setError, setStatus:parentStatus}) => {
    const inputRef=useRef(null)
    const [isMode,setIsMode]=useState('Timed(60s)');
    const [difficulty,setDifficulty]=useState('Easy')
    const [typed, setTyped]=useState('')
    const [text,setText]=useState('')
    const [isRunning,setIsRunning]=useState(false)
    const [elapsedTime, setElapsedTime] = useState(isMode === "Timed(60s)" ? 60 : 0);
    const [wpm, setWpm]=useState(0)
    const [accuracy,setAccuracy]=useState(0)
    const [showMode,setShowMode]=useState(false)
    const [correct,setCorrect]=useState(0)
    const [typing,setTyping]=useState(true)
    const [status,setStatus]=useState('idle')
    const [timerKey, setTimerKey] = useState(0);
    const [totalError,setTotalEror]=useState(0)
    const [keyPressed, setKeyPressed]=useState(0)
    
 
    const Difficulty=["Easy","Medium", "Hard"]
    const mode=["Timed(60s)","Passage"]

    // text generater
    const generateText=(diff)=>{
       const key = diff || 'Easy'
    const list = Paragraphs[key] || []
    if (!Array.isArray(list) || list.length === 0) return ''
    let prev=0
    let index;
    do{
     index = Math.floor(Math.random() * list.length)
    }while(prev===index)
    const item = list[index]
    prev=index;
    return (item && (item.text || item)) || ''

    }
    const resetTest=()=>{
        setTimerKey(k=>k+1)
        setStatus('idle')
        setTyped('')
        setTotalEror(0)
        setKeyPressed(0)
        setText(generateText(difficulty))
        setIsRunning(false)
        setElapsedTime(isMode === "Timed(60s)" ? 60 : 0)
        setWpm(0)
        setAccuracy(0)
        setShowMode(false)
        setCorrect(0)
        setTyping(true)
        inputRef.current?.focus()
        loadText()
    }
    // text loader
    const loadText=()=>{
        const newText=generateText(difficulty)
        setText(newText)
    }
    useEffect(()=>{
        loadText()
    },[difficulty])

    // input handler
    const handleChange=(e)=>{
        const userInput= e.target.value

        if(userInput.length > typed.length){
            const charIndex=userInput.length -1
            const enteredChar=userInput[charIndex]
            const correctChar=text[charIndex]
            setKeyPressed(prev=>prev + 1)

            if(enteredChar != correctChar){
                setTotalEror(prev=>prev + 1)
            }
        }
        setCorrect(keyPressed-totalError)
        setTyped(userInput)
        setShowMode(true)
        setIsRunning(true)
        inputRef.current?.focus()
        setStatus('running')
}

    // wpm
    useEffect(()=>{
    let minute=(60-elapsedTime)/60;
     if(isMode==="Timed(60s)"){
        setWpm(minute?Math.round(correct/(5*minute)):0)
    }else{
        minute=elapsedTime/60;
        setWpm(minute?Math.round(correct/(5*minute)):0)
    } 

    },[isMode,elapsedTime])

    // accuracy
    useEffect(()=>{

        const accu=keyPressed > 0
        ?Math.floor(((keyPressed-totalError)/keyPressed)*100)
        :100
        setAccuracy(accu)

    },[keyPressed,totalError])
    
    useEffect(()=>{
        // finish status
        if(status!='running') return;
        const textFinish=(typed.length===text.length) && text.length>0
        const timeFinish=(isMode==="Timed(60s)" && elapsedTime===0)
        if(textFinish ||timeFinish){
        setIsRunning(false)
        setTyping(false)
        setStatus('finished')
    }
    },[typed,isRunning,isMode,text,elapsedTime])

    // final result
    useEffect(()=>{
        if (status!="finished")return;
        if(!typing){
            setSpeed?.(wpm)
            setFinalAccuracy?.(accuracy)
            setFinalCorrect?.(typed
                .split('')
                .filter((char,index)=>char === text[index])
                .length
            )
            setError?.(typed
                .split('')
                .filter((char,index)=>char !=text[index])
                .length
            )
            parentStatus?.("result")
        }
    })
  return (
    <div className='text-neutral-100  w-full pt-5 lg:px-20 px-4 max-h-screen relative bg-neutral-900 '>

        {/* status info  and mode*/}
        <div className='lg:flex justify-between mt-18  bg-neutral-900 z-1 '>
            {/* status */}
            <div className='flex justify-between md:justify-start w-fit  py-2 sm:text-2xl lg:text-[1em] h-fit  '>
               <div className="flex flex-col md:flex-row h-fit ">
                <span className='text-neutral-400 px-1   text-center'>WPM:</span>
                <span className='font-bold  text-center '>{wpm}</span>
               </div>

               <div className="border-l border-neutral-800 h-10 lg:h-5 mx-4"></div>

               <div className="flex flex-col md:flex-row h-fit">
                <span className='text-neutral-400 px-1 block text-center'>Accuracy:</span>
                <span className={`block text-center font-bold ${isRunning?'text-red-500':''}`}>{accuracy}%</span>
               </div>
               <div className="border-l border-neutral-800 h-10 lg:h-5 mx-4"></div>

               <div className="flex flex-col md:flex-row  h-fit">
                <span className='text-neutral-400 px-1 block text-center'>Time:</span>
                <span className={`block text-center font-bold font-sora ${isRunning?'text-yellow-400':''}`}>{<Timer key={timerKey} isRunning={isRunning} mode={isMode} onTimeChange={setElapsedTime}/>}</span>
               </div>
            </div>


            {/**modes */}
            <div className='flex lg:justify-end w-full '>
                {/* Desktop View */}
                <div  className='md:flex lg:justify-between w-fit hidden h-fit py-2'>
                <div className="flex gap-2">
                    <span className='text-neutral-400 px-1'>Difficulty:</span>
                    {Difficulty.map((dif)=>(
                        <button 
                        key={dif}
                        onClick={()=>{
                            setDifficulty(dif)
                        }}
                        className={`block border rounded-lg hover:text-blue-400 hover:border-blue-400' focus:outline-2 focus:outline-blue-400 active active:scale-95 transition-all px-1 lg:max-w-fit ${
                           difficulty===dif?'text-blue-400 border-blue-400':'' }`}
                        disabled={isRunning}>{dif}</button>
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
                        className={`block border rounded-lg hover:text-blue-400 hover:border-blue-400' focus:outline-2 focus:outline-blue-400 active active:scale-95 transition-all px-1 ${
                           isMode===mo?'text-blue-400 border-blue-400':'' }`}
                        disabled={isRunning}>{mo}</button>
                    ))}
                </div>
                </div>

                {/* Mobile View */}
                <div className='flex gap-2 justify-start sm:ml-5 w-full md:hidden'>
                    <DropDown
                    options={Difficulty}
                    SetOptions={setDifficulty}
                    isRunning={isRunning}
                    />
                    <DropDown
                    options={mode}
                    SetOptions={setIsMode}
                    isRunning={isRunning}
                    />
                </div>
            </div>
        </div>
        <hr className='mt-3 text-neutral-600'/>
                <Displaytext
                    text={text}
                    typed={typed}
                    showMode={showMode}
                    setShowMode={setShowMode}
                    setIsRunning={setIsRunning}
                    inputRef={inputRef}
                    handleChange={handleChange}
                    onRestart={resetTest}
                    setStatus={setStatus}
                />
                <div className="text-neutral-100 w-full text-center fixed bottom-0 text-[0.75em] z-0">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" className="text-blue-500 hover:text-blue-400 hover:underline">Frontend Mentor</a>. 
    Coded by <a href="https://github.com/mikimek23" className="text-blue-500 hover:text-blue-400 hover:underline">Mikiyas Mekbib</a>.
  </div>
       
    </div>
  )
}
