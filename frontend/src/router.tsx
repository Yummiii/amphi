import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import About from "./pages/about";
import MainTemplate from "./templates/main-template/main-template";
import Login from "./pages/login/login";
import Board from "./pages/board/board";
import Register from "./pages/register/register";
import Profile from "./pages/profile/profile";

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
            {
                path: "/boards/:slug",
                element: <Board />,
            },
            {
                path: "/Profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);

export default router;
