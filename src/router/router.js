import { createBrowserRouter, Navigate } from "react-router-dom";
import AppTest from "../test/App.test";
import Cover from "../views/cover/Cover";
import LiosoNaBudget from "../views/LiosoNaBudget";
import SIgninPage from '../views/signin/SigninPage';

const protectedRoutes = () => [
    {
        element: <LiosoNaBudget/>,
        path: '*',
    }
];
const unprotectedRouter = (getters, setters) => [
    {
        element: <Cover getters={getters} setters={setters}/>,
        path: '*',
    }
];

const bublicsRoutes = () => [
    {
        element: <AppTest/>,
        path: '/test',
    },
    {
        element: <SIgninPage/>,
        path:  `${process.env.PUBLIC_URL.trim()}/account/signin`,
    },
];

const router = (getters, setters) => createBrowserRouter([
    ...bublicsRoutes(getters, setters),
    ...getters.connected ? 
    protectedRoutes(getters, setters) : 
    unprotectedRouter(getters, setters)
]);

export default router;