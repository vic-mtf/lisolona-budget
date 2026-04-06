import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/views/home/Home";
import TestApp from "@/test/App.test";
import { createElement } from "react";
import Main from "@/views/main/Main";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import Conference from "@/views/conference/Conference";
import SignInPage from "@/views/signin/SignInPage";

const PUBLIC_URL = import.meta.env.BASE_URL;

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  props?: Record<string, unknown>;
}

const PROTECTED_ROUTES: RouteConfig[] = [
  {
    path: "/conference/create",
    component: Conference,
  },
  {
    component: Main,
    path: "/*",
  },
];

const UNPROTECTED_ROUTES: RouteConfig[] = [
  {
    component: HomePage,
    path: "/*",
  },
];

const PUBLIC_ROUTES: RouteConfig[] = [
  {
    path: "/conference/:code",
    component: Conference,
  },
  {
    path: "/account/signin/*",
    component: SignInPage,
  },
];

const DEV_ROUTES: RouteConfig[] = [
  {
    path: "/test/*",
    component: TestApp,
  },
];

const PRODUCTION_ROUTES: RouteConfig[] = [];

const router = (connected: boolean) => {
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
