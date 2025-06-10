import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <h1>Navbar aqui</h1>
      <Outlet />
    </>
  );
}
