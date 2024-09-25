import TopBar from "../components/TopBar.tsx";
import {
  UsergroupAddOutlined,
  DollarCircleOutlined,
  PieChartOutlined,
  TransactionOutlined,
  UserOutlined,
  HomeOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import NavCard from "../components/NavCard.tsx";

const NavCardData = [
  {
    id:1,
    name:"Dashboard",
    to:"/dashboard",
    icon:<PieChartOutlined style={{ fontSize: '22px' }}/>
  },
  {
    id:2,
    name:"Profile",
    to:"/dashboard/profile",
    icon:<UserOutlined style={{ fontSize: '22px' }}/>
  },
  {
    id:3,
    name:"Wahumini",
    to:"/dashboard/wahumini",
    icon:<UsergroupAddOutlined style={{ fontSize: '22px' }}/>
  },
  {
    id:4,
    name:"Sadaka",
    to:"/dashboard/sadaka",
    icon:<TransactionOutlined style={{ fontSize: '22px' }}/>
  },
  {
    id:4,
    name:"Ujenzi",
    to:"/dashboard/michango",
    icon:<HomeOutlined style={{ fontSize: '22px' }}/>
  },
  {
    id:4,
    name:"Zaka",
    to:"/dashboard/zaka",
    icon:<DollarCircleOutlined style={{ fontSize: '22px' }}/>
  },
  {
    id:4,
    name:"Michango",
    to:"/dashboard/michango",
    icon:<ShoppingOutlined style={{ fontSize: '32px' }}/>
  },
]


const Home = () => {
  // const isDarkMode = useAppSelector((state) => state.AppStateReducer.isDarkMode);

  return (
    <div className="Home p-10 border-white mb-2">
      <TopBar />
      <div className="flex justify-center px-2">
        <div className="grid grid-cols-1 mt-10 gap-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {NavCardData.map((item) => (
              <NavCard key={item.id}
                       name={item.name}
                       icon={item.icon}
                       id={item.id}
                       to={item.to}
              />
          ))}
        </div>
      </div>
    </div>
  );
};


export default Home;
