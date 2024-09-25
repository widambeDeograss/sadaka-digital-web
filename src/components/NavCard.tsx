import { useNavigate } from 'react-router-dom';

interface NavCardProps {
    id: number;
    name: string;
    icon: JSX.Element;
    to: string;
}


function NavCard({id,name, icon, to}:NavCardProps) {
    const navigate = useNavigate()

  return (
    <div key={id}

    >
        <div className="bg-[#152033] p-1 max-w-md min-w-[240px] h-32 rounded-lg   mb-1 hover:scale-105 transition-transform"
         onClick={() => {
          navigate(to)
         }}
        >
          <div className='flex flex-col justify-center items-center mt-5'>
            <div>{icon}</div>
            <h3 className='font-bold text-xs mt-3'>{name}</h3>

          </div>
         </div>
    </div>
  )
}

export default NavCard
