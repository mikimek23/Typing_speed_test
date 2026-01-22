

import { BetResult } from "./components/BetResult"
import { FirstResult } from "./components/FirstResult"
import { Header } from "./components/Header"
import { Results } from "./components/Results"
import { StatusMode } from "./components/statusMode"

//import { useState } from "react"
//import { StartComp } from "./components/StartComp"

function App() {
 // const [showModal,setShowModal]=useState(true)
  return (
    <div className="w-full h-screen  bg-neutral-900">
      <Header/>
      <StatusMode/>
      {/* <StatusMode/>
      <Paragraphs/>
       */}
    </div>
  )
}

export default App
