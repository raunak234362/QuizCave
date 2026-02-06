import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png";
const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-800/30 border-4 border-white rounded-lg p-2 text-black flex flex-col py-5  h-screen ">
      <div className="flex flex-col items-center h-screen justify-between">
        <div>
          <div className="bg-white rounded-2xl p-2 mb-5 shadow-lg">
            <img src={Logo} alt="" />
          </div>
          <nav>
            <ul className="flex flex-col gap-5">
              <li>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    `flex items-center text-center px-8 py-2 rounded-md ${
                      isActive
                        ? "bg-teal-400 font-semibold text-center text-black"
                        : "text-gray-700 hover:bg-teal-700 hover:text-black"
                    }`
                  }
                >
                  Profile
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="contest"
                  className={({ isActive }) =>
                    `flex items-center text-center px-8 py-2 rounded-md ${
                      isActive
                        ? "bg-teal-400 font-semibold text-center text-black"
                        : "text-gray-700 hover:bg-teal-700 hover:text-black"
                    }`
                  }
                >
                  Contest
                </NavLink>
              </li>
              {/* <li>
                  <NavLink
                    to="result"
                    className={({ isActive }) =>
                      `flex items-center text-center px-8 py-2 rounded-md ${
                        isActive
                          ? "bg-teal-400 font-semibold text-center text-black"
                          : "text-gray-700 hover:bg-teal-700 hover:text-black"
                      }`
                    }
                  >
                    Results
                  </NavLink>
                </li> */}
            </ul>
          </nav>
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
