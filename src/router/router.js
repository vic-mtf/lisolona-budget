import { createBrowserRouter } from "react-router-dom";
//import SignInPage from "../views/signin/SignInPage";
import HomePage from "../views/home/Home";
import TestApp from "../test/App.test";
import { createElement } from "react";
import Main from "../views/main/Main";
import RouteErrorBoundary from "../components/RouteErrorBoundary";
import Conference from "../views/conference/Conference";

const PUBLIC_URL = import.meta.env.BASE_URL;

const PROTECTED_ROUTES = [
  {
    path: "/conference/create",
    component: Conference,
  },
  {
    component: Main,
    path: "/*",
  },
];

const UNPROTECTED_ROUTES = [
  {
    component: HomePage,
    path: "/*",
  },
];

const PUBLIC_ROUTES = [
  {
    path: "/conference/:code",
    component: Conference,
  },
];

const DEV_ROUTES = [
  {
    path: "/test/*",
    component: TestApp,
  },
];

const PRODUCTION_ROUTES = [];

if (window.opener) PUBLIC_ROUTES.push();

const router = (connected) => {
  const routes = [
    PUBLIC_ROUTES,
    connected ? PROTECTED_ROUTES : UNPROTECTED_ROUTES,
    import.meta.env.DEV ? DEV_ROUTES : PRODUCTION_ROUTES,
  ]
    .flat()
    .map(({ component, props, ...otherParams }) => ({
      element: createElement(component, props),
      errorElement: createElement(RouteErrorBoundary),
      ...otherParams,
    }));
  return createBrowserRouter(routes, {
    basename: PUBLIC_URL,
  });
};

export default router;
