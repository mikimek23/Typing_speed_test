

import { useEffect, useState } from "react"
import { BetResult } from "./components/BetResult"
import { FirstResult } from "./components/FirstResult"
import { Header } from "./components/Header"
import { Results } from "./components/Results"
import { StatusMode } from "./components/StatusMode"


function App() {
const [speed,setSpeed]=useState(0)
const [finalAccuracy,setFinalAccuracy]=useState(100)
const [finalCorrect,setFinalCorrect]=useState(0)
const [error,setError]=useState(0)
const [status,setStatus]=useState("Typing")
const [personalBest,setPersonalBest]=useState(0)
const [trial,setTrial]=useState('')
useEffect(() => {
  setPersonalBest(prevBest => {
    if (speed > prevBest) {
      setTrial(prevBest === 0 ? "first" : "high");
      return speed;
    }else{
      setTrial('')
    }
    return prevBest;
  });
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
     {status==="Typing"?<StatusMode
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
