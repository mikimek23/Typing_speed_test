
import LargeLogo from "../assets/images/logo-large.svg";
import personal from "../assets/images/icon-personal-best.svg";
export const Header = () => {
  return (
    <div className='text-white fixed top-0 w-full py-5 px-50'>
        {/*logo and porsonal Info */}
        <div className='flex flex-1 justify-between '>
            <img src={LargeLogo} alt="logo" class='w-50' />
            <div>
                <img src={personal} alt="personal-best" className='inline p-1' />
                <span className='text-neutral-400 p-0.5'>Personal best:</span>
                <span className='font-bold p-0.5'>92WPM</span>
            </div>
        </div>
    </div>
  )
}
