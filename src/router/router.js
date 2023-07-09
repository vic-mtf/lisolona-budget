import { createBrowserRouter, Navigate } from "react-router-dom";
import AppTest from "../test/App.test";
import Cover from "../views/cover/Cover";
import LiosoNaBudget from "../views/LiosoNaBudget";
import SIgninPage from '../views/signin/SigninPage';
import HomePage from "../views/home/HomePage";
import Meeting from "../views/meeting/Meeting";

const url = process.env.PUBLIC_URL.trim();

const protectedRoutes = (getters, setters) => [
    {
        element: getters?.isStarted?.current ? <Cover getters={getters} setters={setters}/> : <LiosoNaBudget/>,
        path:  `${url}/*`,
    },
];
const unprotectedRouter = (getters, setters) => [
    {
        element: <Navigate to="/home"/>,
        path: `${url}/*`,
    },
    {
        element: <HomePage/>,
        path:  `${url}/home/*`,
    },
    {
        element: <SIgninPage/>,
        path:  `${url}/account/signin`,
    },
];

const bublicsRoutes = () => [
    {
        element: <AppTest/>,
        path: '/test',
    },
    {
        element: <Meeting/> ,
        path: `${url}/meeting/*`,
    }
];

const router = (getters, setters) => createBrowserRouter([
    ...bublicsRoutes(getters, setters),
    ...getters.connected ? 
    protectedRoutes(getters, setters) : 
    unprotectedRouter(getters, setters)
]);

export default router;