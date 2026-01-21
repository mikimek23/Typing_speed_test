import React, { useEffect, useRef } from 'react'

export const StartComp = ({isOpen,onClose,children}) => {
    const dialogRef=useRef(null)
    useEffect(()=>{
        if(!dialogRef.current) return;
        if(isOpen){
            dialogRef.current.showModal()
        }else{
            dialogRef.current.close();
        }
    },[isOpen])

   const handleOutsideClick = (e) => {
    // This checks if you clicked the dark background 
    // instead of the content (children)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className='w-full py-5 px-50'>
        <dialog  
        ref={dialogRef} 
        onClose={onClose}
        className='w-full py-5 px-50 h-full mt-35 bg-transparent backdrop-blur-sm text-neutral-50 absolute content-center justify-items-center' >
           <div 
        onClick={handleOutsideClick}
        className="w-full py-5 px-50  h-full flex items-center justify-center"
      >
       
        <div className="max-w-full  py-5 px-50 justify-items-center pointer-events-auto">
           {children}
        </div>
      </div>
        </dialog>
    </div>
  )
}
{/* <StartComp
      isOpen={showModal} 
      onClose={()=>setShowModal(false)}
      onClick={()=>setShowModal(false)}
      >
       <div className="w-fit border p-0.5 rounded-lg border-blue-500">
        <button onClick={() => setShowModal(false)} className="block bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded-lg">
          Start Typing Test
        </button>
       </div>
       <p className="font-bold">Or click the text and start typing</p>
        
      </StartComp> */}