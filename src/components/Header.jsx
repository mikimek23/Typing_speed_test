
import LargeLogo from "../assets/images/logo-large.svg";
import SmallLogo from "../assets/images/logo-small.svg";
import personal from "../assets/images/icon-personal-best.svg";
export const Header = ({PersonalBest}) => {
  return (
    <div className='text-neutral-100 fixed bg-neutral-900 top-0 w-full py-5 lg:px-20 px-4 z-1'>
        {/*logo and porsonal Info */}
        <div className='flex flex-1 justify-between '>
            <img src={LargeLogo} alt="logo" class='w-50 sm:block hidden' />
            <img src={SmallLogo} alt="logo" class=' sm:hidden' />
            <div>
                <img src={personal} alt="personal-best" className='inline p-1' />
                <span className='text-neutral-400 p-0.5'>Personal best:</span>
                <span className='font-bold p-0.5'>{PersonalBest} WPM</span>
            </div>
        </div>
    </div>
  )
}
