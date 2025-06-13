import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import About from "./pages/about";
import MainLayout from "./templates/main-layout";
import Login from "./pages/login/login";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router; 