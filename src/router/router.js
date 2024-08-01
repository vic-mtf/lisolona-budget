import { createBrowserRouter, Navigate } from "react-router-dom";
// import Views from "../views/Views";
import SignInPage from "../views/signin/SignInPage";
import HomePage from "../views/home/Home";
// import Meeting from "../views/meeting/Meeting";
import { createElement } from "react";

const PUBLIC_URL = process.env.PUBLIC_URL.trim();

const PROTECTED_ROUTES = [
  // {
  //   component: Views,
  //   path: "/*",
  // },
];

const UNPROTECTED_ROUTES = [
  {
    component: Navigate,
    path: "/*",
    props: {
      to: "/home",
    },
  },
  {
    component: HomePage,
    path: "/home/*",
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
