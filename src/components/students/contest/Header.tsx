
"use Client"
import type { UserData } from "../../Interfaces/index";
import logo from "../../../assets/logo.png";

interface HeaderProps {
  user?: UserData;
  contest?: string;
}

export const Header = ({ user, contest }: HeaderProps) => {
  
  return (
    <header className="w-full flex flex-row justify-between bg-[#6adb45] h-16 items-center pr-4 cursor-none">
      <img src={logo} alt="" className="bg-white h-16" />
      <h1 className="text-white text-4xl font-bold">{contest}</h1>
      <div className="text-black text-3xl font-semibold h-16 flex flex-row items-center">
        {user?.name}
        <img
          src={`${import.meta.env.VITE_IMG_URL}/${user?.profile}`}
          alt="user-picture"
          className="h-12 w-12 rounded-[100%] mx-2"
        />
      </div>
    </header>
  );
};
