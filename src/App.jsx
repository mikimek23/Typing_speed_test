

import { useEffect, useState } from "react"
import { BetResult } from "./components/BetResult"
import { FirstResult } from "./components/FirstResult"
import { Header } from "./components/Header"
import { Results } from "./components/Results"
import { TypingTest } from "./components/TypingTest"


function App() {
const [speed,setSpeed]=useState(0)
const [finalAccuracy,setFinalAccuracy]=useState(100)
const [finalCorrect,setFinalCorrect]=useState(0)
const [error,setError]=useState(0)
const [status,setStatus]=useState("Typing")
const [personalBest,setPersonalBest]=useState(()=>{
  const highScore=localStorage.getItem("highScore")
  return highScore?JSON.parse(highScore):0
})
const [trial,setTrial]=useState('')
useEffect(() => {
  if(speed>personalBest){
    if(personalBest===0){ 
      setTrial('first')
    }else{
      setTrial('high')
    }
    setPersonalBest(speed)
    localStorage.setItem("highScore",JSON.stringify(speed))
  }
}, [speed]);

const handleRestart = () => {
  setSpeed(0)
  setFinalAccuracy(100)
  setFinalCorrect(0)
  setError(0)
  setTrial('')
  setStatus('Typing')
}
  return (
    <div className="w-screen min-h-screen  bg-neutral-900">
      <Header
      PersonalBest={personalBest}
      />
     {status==="Typing"?<TypingTest
      setSpeed={setSpeed}
      setFinalAccuracy={setFinalAccuracy}
      setFinalCorrect={setFinalCorrect}
      setError={setError}
      setStatus={setStatus}
      onRestart={handleRestart}
      />
      :(trial==="first"?
      <FirstResult
        speed={speed}
        accuracy={finalAccuracy}
        correct={finalCorrect}
        error={error}
        onRestart={handleRestart}
      />
      :(trial==="high"?
        <BetResult
          speed={speed}
          accuracy={finalAccuracy}
          correct={finalCorrect}
          error={error}
          onRestart={handleRestart}
        />
      :<Results
      speed={speed}
      accuracy={finalAccuracy}
      correct={finalCorrect}
      error={error}
      onRestart={handleRestart}
      />)
    )
    }
    </div>
  )
}

export default App
