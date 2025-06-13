import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import About from "./pages/about";
import MainTemplate from "./templates/main-template/main-template";
import Login from "./pages/login/login";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainTemplate />,
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
