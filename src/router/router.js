import { createBrowserRouter, Navigate } from "react-router-dom";
import AppTest from "../test/App.test";
import Cover from "../views/cover/Cover";
import LiosoNaBudget from "../views/LiosoNaBudget";
import SIgninPage from '../views/signin/SigninPage';
import HomePage from "../views/home/HomePage";
import Meeting from "../views/meeting/Meeting";

const basename = process.env.PUBLIC_URL.trim();

const protectedRoutes = (getters, setters) => [
    {
        element: getters?.isStarted?.current ? 
        <Cover getters={getters} setters={setters}/> : <LiosoNaBudget/>,
        path:  '/*'
    },
];
const unprotectedRouter = (getters, setters) => [
    {
        element: <Navigate to="/home"/>,
        path: '/*',
    },
    {
        element: <HomePage/>,
        path:  '/home/*',
    },
    {
        element: <SIgninPage/>,
        path:  '/account/signin/*',
    },
];

const publicsRoutes = () => [
    {
        element: <AppTest/>,
        path: '/test',
    },
    {
        element: <Meeting/> ,
        path: '/meeting/*',
    }
];

const router = (getters, setters) => createBrowserRouter([
    ...publicsRoutes(getters, setters),
    ...getters.connected ? 
    protectedRoutes(getters, setters) : 
    unprotectedRouter(getters, setters)
],{
    basename,
});

export default router;