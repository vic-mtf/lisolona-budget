import { createBrowserRouter } from "react-router-dom";
import SignInPage from "../views/signin/SignInPage";
import HomePage from "../views/home/Home";
// import Meeting from "../views/meeting/Meeting";
import { createElement } from "react";
import MainView from "../views/main-view/MainView";

const PUBLIC_URL = import.meta.env.BASE_URL;

const PROTECTED_ROUTES = [
  {
    component: MainView,
    path: "/*",
  },
];

const UNPROTECTED_ROUTES = [
  {
    component: HomePage,
    path: "/*",
  },
  {
    component: SignInPage,
    path: "/account/signin/*",
  },
];

const PUBLIC_ROUTES = [
  //   {
  //     component: Meeting,
  //     path: "/meeting/*",
  //   },
];

const router = (connected) => {
  const routes = [
    PUBLIC_ROUTES,
    connected ? PROTECTED_ROUTES : UNPROTECTED_ROUTES,
  ]
    .flat()
    .map(({ component, props, ...otherParams }) => ({
      element: createElement(component, props),
      ...otherParams,
    }));
  return createBrowserRouter(routes, { basename: PUBLIC_URL });
};

export default router;
