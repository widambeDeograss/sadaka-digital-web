import { BrowserRouter as Router, Navigate, useRoutes } from 'react-router-dom';
import Home from "../pages/Home.tsx";
import Login from '../pages/auth/Login.tsx';
import Registration from '../pages/auth/register.tsx';
import Main from '../Layouts/SharikaAdmin/index.tsx';
import Dashboard from '../pages/Dashboard.tsx';
import Michango from '../pages/michango/michango.tsx';
import Profile from "../pages/Profile.tsx";
import OngezaMchango from "../pages/michango/OngezaMchango.tsx";
import Mchango from "../pages/michango/mchango.tsx";
import Zaka from "../pages/zaka/Zaka.tsx";
import Sadaka from "../pages/sadaka/Sadaka.tsx";
import Ahadi from "../pages/Ahadi/Ahadi.tsx";
import Wahumini from "../pages/wahumini/Wahumini.tsx";
import Muhumini from "../pages/wahumini/Muhumini.tsx";
import OngezaMuhumini from "../pages/wahumini/OngezaMuhumini.tsx";
import Expenses from "../pages/Expenses/Expenses.tsx";
import { useAppSelector } from '../store/store-hooks.ts';


const AppRouter = () => {
  const isAuthenticated = useAppSelector(state =>  state.user.isAuthenticated);

    <Router></Router>;
    const routes = useRoutes([
        {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Registration />,
          },
          {
            path: "/",
            element:  isAuthenticated == true ? <Home /> : <Navigate to="/login" />,
            // element: <Home />,
          },
        {
            path: "/dashboard/*",
            element:  isAuthenticated == true ? <Main /> : <Navigate to="/login" />,
            // element: <Main/>,
            children: [
                { element: <Navigate to="home" />,index:true},
                {path:"home", element:<Dashboard />},
                {path:"michango/iliyopo", element:<Michango />},
                {path:"michango/ongeza", element:<OngezaMchango />},
                {path:"mchango/:id", element:<Mchango />},
                {path:"zaka", element:<Zaka/>},
                {path:"sadaka", element:<Sadaka/>},
                {path:"profile", element:<Profile />},
                {path:"ahadi", element:<Ahadi />},
                {path:"wahumini/waliopo", element:<Wahumini/>},
                {path:"wahumini/ongeza", element:<OngezaMuhumini/>},
                {path:"muhumini/:id", element:<Muhumini />},
                {path:"matumizi", element:<Expenses />},

            ],
        }
    ]);

    return routes;
}

export default AppRouter
