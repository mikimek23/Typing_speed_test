import React, { useEffect, useState } from 'react'

export const Timer = ({isrunning}) => {
    const [timeLeft,setTimeLeft]=useState(60)
    useEffect(()=>{
         if(!isrunning||timeLeft===0) return;
         const interval= setInterval(()=>{
            setTimeLeft(prev=>prev-1)
         },1000)
         return ()=>clearInterval(interval)
    })
    let second=timeLeft
   const minute=Math.floor(timeLeft/60)
    second=second%60
  return (
    <div className="font-sora font-bold">
        {minute}:{second}
    </div>
  )
}