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
import UsersList from '../pages/users/UsersList.tsx';
import RolesList from '../pages/roles/RolesList.tsx';
import SpList from '../pages/service-providers/SpsList.tsx';
import CardNumberList from '../pages/wahumini/CardNumbers.tsx';
import PaymentTypeList from '../pages/settings/payment/PaymentCategoryList.tsx';
import ExpenseCategoryList from '../pages/settings/expenditurecat/Expenditure.tsx';
import SystemPackagesList from '../pages/package/SytemPackageList.tsx';
import SpPackages from '../pages/package/SpPackages.tsx';
import ZakaReportTable from '../pages/zaka/ZakaTotals.tsx';
import SadakaReportTable from '../pages/sadaka/SadakaMonthlyTotals.tsx';
import KandaJumuiya from '../pages/wahumini/jumuiya/JumuiyaList.tsx';
import SpManagerList from '../pages/users/SpManagerList.tsx';
import UpdateMuhumini from '../pages/wahumini/EditMuhumini.tsx';
import EditMchango from '../pages/michango/EditMchango.tsx';


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
          },
        {
            path: "/dashboard/*",
            element:  isAuthenticated == true ? <Main /> : <Navigate to="/login" />,
            children: [
                { element: <Navigate to="home" />,index:true},
                {path:"home", element:<Dashboard />},
                {path:"michango/iliyopo", element:<Michango />},
                {path:"michango/ongeza", element:<OngezaMchango />},
                {path:"michango/update", element:<EditMchango />},
                {path:"mchango/:id", element:<Mchango />},
                {path:"zaka", element:<Zaka/>},
                {path:"zaka-monthly-report", element:<ZakaReportTable/>},
                {path:"sps", element:<SpList/>},
                {path:"packages", element:<SpPackages/>},
                {path:"users/list", element:<UsersList/>},
                {path:"sp-users/list", element:<SpManagerList/>},
                {path:"users/roles", element:<RolesList/>},
                {path:"sadaka", element:<Sadaka/>},
                {path:"sadaka-monthly-report", element:<SadakaReportTable/>},
                {path:"profile", element:<Profile />},
                {path:"ahadi", element:<Ahadi />},
                {path:"wahumini/waliopo", element:<Wahumini/>},
                {path:"wahumini/ongeza", element:<OngezaMuhumini/>},
                {path:"wahumini/update", element:<UpdateMuhumini/>},
                {path:"wahumini/bahasha", element:<CardNumberList/>},
                {path:"wahumini/kanda-jumuiya", element:<KandaJumuiya/>},
                {path:"muhumini/:id", element:<Muhumini />},
                {path:"settings/payment-type", element:<PaymentTypeList />},
                {path:"settings/system-package", element:<SystemPackagesList />},
                {path:"settings/expense-categories", element:<ExpenseCategoryList />},
                {path:"matumizi", element:<Expenses />},

            ],
        }
    ]);

    return routes;
}

export default AppRouter
