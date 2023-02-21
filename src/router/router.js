import { createBrowserRouter, Navigate } from "react-router-dom";
import AppTest from "../test/App.test";
import LiosoNaBudget from "../views/LiosoNaBudget";

const router = createBrowserRouter([
    {
        element: <AppTest/>,
        path: '/test',
    },
    {
        element: <LiosoNaBudget/>,
        path: '*',
    },
]);

export default router;