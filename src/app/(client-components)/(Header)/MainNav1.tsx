import React, { FC } from "react";
import Logo from "@/shared/Logo";
import Navigation from "@/shared/Navigation/Navigation";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "@/shared/ButtonPrimary";
import MenuBar from "@/shared/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import LangDropdown from "./LangDropdown";
import CurrencySelector from "@/shared/CurrencySelector";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Avatar from "@/shared/Avatar";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Cart from "./Cart";
import { PhoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export interface MainNav1Props {
  className?: string;
}

const MainNav1: FC<MainNav1Props> = ({ className = "" }) => {
  const router = useRouter();
  const { user, jwtToken } = useSelector(
    (state: RootState) => state.users
  );
  const { globalData } = useSelector((state: RootState) => state.initials)



  return (
    <div className={`nc-MainNav1 relative z-10 ${className}`}>
      <div className="px-4 lg:container h-20 relative flex justify-between">
        <div className="flex justify-center md:justify-start flex-1 space-x-4 sm:space-x-10">
          <Logo imgLight={process.env.NEXT_PUBLIC_COMPANY_LOGO} img={process.env.NEXT_PUBLIC_COMPANY_LOGO} className="w-36 self-center" />
          {/* <Navigation /> */}
        </div>

        <div className="hidden md:flex lg:hidden flex-[3] max-w-lg !mx-auto md:px-3 ">
          <div className="self-center flex-1">
            <HeroSearchForm2MobileFactory />
          </div>
        </div>

        <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="hidden xl:flex space-x-0.5">
            <Link href={"/contact" as Route} className="self-center px-3 cursor-pointer">Contact us</Link>

            <a href={`tel:${globalData?.home?.phoneNumber1}`} className="self-center px-3 cursor-pointer flex items-center">
              <span className=""><PhoneIcon className="w-4 h-4" /></span>
              <span className="">{globalData?.home?.phoneNumber1}</span>
            </a>
            <Cart className="flex items-center" />
            <CurrencySelector className="flex items-center" />
            <SwitchDarkMode />
            <div className="px-1" />
            {!user?.name && (
              <ButtonPrimary className="self-center" href={"/login" as Route}>
                Login
              </ButtonPrimary>
            )}

            {user?.name && jwtToken && (
              <div
                onClick={() => router.push("/profile" as Route)}
                className="self-center cursor-pointer">
                <Avatar userName={user?.name} sizeClass="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="flex xl:hidden items-center">
            <SwitchDarkMode />
            <div className="px-0.5" />
            <MenuBar />
          </div>
        </div>
      </div>
      <div className="flex md:hidden flex-[3] max-w-lg !mx-auto md:px-3 ">
        <div className="self-center flex-1">
          <HeroSearchForm2MobileFactory />
        </div>
      </div>
    </div>
  );
};

export default MainNav1;
