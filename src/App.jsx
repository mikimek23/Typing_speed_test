

import { Header } from "./components/Header"
import { Paragraphs } from "./components/Paragraphs"
import { StatusMode } from "./components/statusMode"

//import { useState } from "react"
//import { StartComp } from "./components/StartComp"

function App() {
 // const [showModal,setShowModal]=useState(true)
  return (
    <div className="w-full h-screen  bg-neutral-900">
      <Header/>
      <StatusMode/>
      <Paragraphs/>
      
    </div>
  )
}

export default App
