import logo from "../assets/church.png"
import { useAppSelector } from '../store/store-hooks';
import ProfileDropdown from './ui/Profile';

const TopBar = () => {
    const church = useAppSelector((state:any) =>  state.sp)

  return (
    <div>
   <div className="relative  shadow-md w-full">
      <div className="absolute bottom-2 -left-1 border-b-0  bg-[#152033]  border-solid rounded-lg w-full h-20"></div>
      <div className="relative z-10 flex justify-between  bg-gradient-to-br  from-[#152033] to-[#3E5C76] w-full h-20 p-3   rounded-lg ">
         <div className="bg-[#152033] max-w-xs min-w-[50px] rounded-lg   mb-1 hover:scale-105 transition-transform">
         <div className='  flex justify-center   p-2 ' >
            <img src={logo} className='h-8 w-8 '/>

              <h3 className='text-xs text-white font-bold  hidden lg:flex md:flex'>
              Sadaka
              <br />
              Digital
              </h3>

            </div>
         </div>
         <div>
         <h3 className='text-xs text-white font-bold text-center mt-1 px-1 lg:mt-4 md:mt-5'>
        {church?.church_name}
              </h3>

          </div>
        <div>

        <div className="hover:scale-105 transform">
          <ProfileDropdown/>
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default TopBar
