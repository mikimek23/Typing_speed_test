import React, { useEffect, useRef, useState } from 'react'
import Paragraphs  from '../../data.json';
import { Timer } from './Timer';
import Displaytext from './Displaytext'


export const StatusMode = ({setSpeed,setFinalAccuracy,setFinalCorrect, setError, setStatus:parentStatus}) => {
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
    const [status,setStatus]=useState('idle')//idle || running || finishid
    const [timerKey, setTimerKey] = useState(0);
    
 
    const Difficulty=["Easy","Medium", "Hard"]
    const mode=["Timed(60s)","Passage"]

    // text generater
    const generateText=(diff)=>{
       const key = diff || 'Easy'
    const list = Paragraphs[key] || []
    if (!Array.isArray(list) || list.length === 0) return ''
    const index = Math.floor(Math.random() * list.length)
    const item = list[index]
    return (item && (item.text || item)) || ''

    }
    const resetTest=()=>{
        setTimerKey(k=>k+1)
        setStatus('idle')
        setTyped('')
        setText(generateText(difficulty))
        setIsRunning(false)
        setElapsedTime(isMode === "Timed(60s)" ? 60 : 0)
        setWpm(0)
        setAccuracy(0)
        setShowMode(false)
        setCorrect(0)
        setTyping(true)
        inputRef.current?.focus()
    }
    useEffect(()=>{
        setText(generateText(difficulty))
    },[difficulty])

    // input handler
    const handleChange=(e)=>{
        const value= e.target.value
        setTyped(value)
        setStatus('running')
    }

    // wpm
    useEffect(()=>{
    let minute=(60-elapsedTime)/60;
     if(isMode==="Timed(60s)"){
        setWpm(minute?Math.round(typed.length/(5*minute)):0)
    }else{
        minute=elapsedTime/60;
        setWpm(minute?Math.round(typed.length/(5*minute)):0)
    } 

    },[isMode,elapsedTime])

    // accuracy
    useEffect(()=>{
        const userInput=typed
        .split('')
        .filter((char,i)=>char===text[i])
        .length
        const accu=typed.length? (userInput/(typed.length))*100 : 100;

        setAccuracy(Math.round(accu))

        setCorrect(userInput)

    })
//9784150
    useEffect(()=>{
        // finish status
        if(status!='running') return;
        if((typed.length===text.length) && text.length>0 ||(isMode==="Timed(60s)" && elapsedTime===0)){
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
            setFinalCorrect?.(correct)
            setError?.(text.length-correct)
            parentStatus?.("result")
        }
    })
    
  return (
    <div className='text-neutral-100  w-full py-5 px-50'>

        {/* status info  and mode*/}
        <div className='flex justify-between mt-20'>
            {/* status */}
            <div className='flex justify-between w-fit pr-40'>
               <div>
                <span className='text-neutral-400 px-1'>WPM:</span>
                <span className='font-bold'>{wpm}</span>
               </div>

               <div className="border-l border-neutral-800 h-5 mx-4"></div>

               <div>
                <span className='text-neutral-400 px-1'>Accuracy:</span>
                <span className={`font-bold ${isRunning?'text-red-500':''}`}>{accuracy}%</span>
               </div>
               <div className="border-l border-neutral-800 h-5 mx-4"></div>

               <div className='flex'>
                <span className='text-neutral-400 px-1'>Time:</span>
                <span className={`font-bold font-sora ${isRunning?'text-yellow-400':''}`}>{<Timer key={timerKey} isRunning={isRunning} mode={isMode} onTimeChange={setElapsedTime}/>}</span>
               </div>
            </div>
            {/**modes */}
            <div className='flex justify-between w-fit '>
                <div className="flex gap-2">
                    <span className='text-neutral-400 px-1'>Difficulty:</span>
                    {Difficulty.map((dif)=>(
                        <button 
                        key={dif}
                        onClick={()=>{
                            setDifficulty(dif)
                        }}
                        className={`block border rounded-lg hover:text-blue-400 hover:border-blue-400' focus:outline-2 focus:outline-blue-400 active active:scale-95 transition-all px-1 ${
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
        </div>
        <hr className='mt-2 text-neutral-500'/>
                <Displaytext
                    text={text}
                    typed={typed}
                    showMode={showMode}
                    setShowMode={setShowMode}
                    setIsRunning={setIsRunning}
                    inputRef={inputRef}
                    handleChange={handleChange}
                    onRestart={resetTest}
                />
       
    </div>
  )
}
