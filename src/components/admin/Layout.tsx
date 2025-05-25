// import { useCallback, useState } from "react";


import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideBar from "./sidebar/SideBar";
// import { useCallback, useState } from "react";

const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = useCallback(() => {
//     setSidebarOpen((prev) => !prev);
//   }, [setSidebarOpen]);
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden md:flex-row bg-gradient-to-tr from-teal-100 to-teal-500">
      <div className="flex flex-col w-full">
        {/* <NotificationReceiver /> */}
        <div className="mx-2 my-2">
          <Header />
        </div>
        {/* Header */}
        <div className="flex flex-row">
          <div
            className={`fixed md:static flex flex-col md:bg-opacity-0 w-64 z-20 transition-transform duration-300  md:translate-x-0 md:w-64`}
          >
            <div className="flex items-center justify-between pl-2">
              <SideBar/>
            </div>
          </div>
          {/* Main Content */}
          <div
            className={`flex h-[89vh] w-full mx-2 border-4 rounded-lg border-white  bg-gradient-to-t from-gray-50/70 to-gray-100/50 overflow-hidden flex-grow transition-all duration-300 `}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
