import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function ProtectedLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default ProtectedLayout;