import { Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div>
            <h1>Navbar aqui</h1>
            <Outlet />
        </div>
    );
}
