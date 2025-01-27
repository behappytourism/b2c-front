import React, { FC, useEffect, useState } from "react";
import Logo from "@/shared/Logo";
import MenuBar from "@/shared/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Avatar from "@/shared/Avatar";
import { useRouter } from "next/navigation";
import { Route } from "next";
import {
  ShoppingCartIcon,
  UserIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { WalletIcon as SolidWallet } from "@heroicons/react/24/solid";
import Link from "next/link";
import priceConversion from "@/utils/priceConversion";

export interface MainNav1Props {
  className?: string;
}

const MainNav1: FC<MainNav1Props> = ({ className = "" }) => {
  const router = useRouter();
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const { cart } = useSelector((state: RootState) => state.attraction);
  const { transferCart } = useSelector((state: RootState) => state.transfer);
  const [enableLogin, setEnableLogin] = useState(false);
  const [displayWallet, setDisplayWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState({balance: 0})

  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );


  const getWalletBalance = async () => {
    try {  
      const walletBalance = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wallet-balance`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 1 },
        }
      );
  
      const data = await walletBalance.json();
      setWalletBalance(data || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWalletBalance();
  },[jwtToken])

  return (
    <>
     
      <div className={`nc-MainNav1 relative z-10 ${className}`}>
        <div className="px-4 lg:container h-20 relative flex justify-between">
          <div className="flex justify-center md:justify-start flex-1 space-x-4 sm:space-x-10">
            <Logo
              imgLight={process.env.NEXT_PUBLIC_COMPANY_LOGO}
              img={process.env.NEXT_PUBLIC_COMPANY_LOGO}
              className="w-36 self-center"
            />
            {/* <Navigation /> */}
          </div>

          <div className="hidden md:flex lg:hidden flex-[3] max-w-lg !mx-auto md:px-3 ">
            <div className="self-center flex-1">
              <HeroSearchForm2MobileFactory />
            </div>
          </div>

          <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
            <div className="hidden xl:flex space-x-0.5">
              <Link
                href={"/contact" as Route}
                className="self-center px-3 cursor-pointer"
              >
                Contact us
              </Link>

             
             {jwtToken && (
               <div onMouseEnter={() => setDisplayWallet(true)} onMouseLeave={() => setDisplayWallet(false)}  className="flex flex-col pr-1 justify-center cursor-pointer">
                {displayWallet ? <SolidWallet className="w-7 h-7 cursor-pointer"/> : <WalletIcon className="w-7 h-7 cursor-pointer"/> }
                
                {displayWallet && (
                  <div className="absolute cursor-pointer bg-white -ml-10 z-10 shadow-sm py-1 px-4 rounded shadow-black/40 top-10">
                    <p>Wallet: <span className="font-extrabold">{priceConversion(walletBalance?.balance, selectedCurrency, true)}</span></p>
                  </div>
                )}
              </div>
              )}


             <Link className="self-center"  href={"/cart" as Route}>
              <p className="absolute bg-orange-400 text-white p-2 rounded-full h-5 w-5 -mt-[8px] ml-[12px] items-center text-xs flex justify-center">{cart?.length + transferCart?.length || 0}</p>
              <ShoppingCartIcon  className="w-7 h-7"  />
              </Link>


              {/* <CurrencySelector className="flex items-center" /> */}
              <SwitchDarkMode />
              <div className="px-1" />
              {!user?.name && (
                <Link className="self-center"  href={"/login" as Route}>
                <div
                  onClick={() => setEnableLogin(true)}
                  className="flex gap-1 items-center cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <p>Login</p>
                </div>
                 </Link>
              )}

              {user?.name && jwtToken && (
                <div
                  onClick={() => router.push("/profile" as Route)}
                  className="self-center cursor-pointer"
                >
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
    </>
  );
};

export default MainNav1;
