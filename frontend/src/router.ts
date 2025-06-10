import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import About from "./pages/about";
import MainLayout from "./templates/main-layout";

const router = createBrowserRouter([
  {
    path: "",
    element: MainLayout(),
    children: [
      {
        path: "/",
        element: Home(),
      },
      {
        path: "/about",
        element: About(),
      },
    ],
  },
]);

export default router;
