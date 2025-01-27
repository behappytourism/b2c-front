"use client";

import React, { useEffect, useState } from "react";
import ButtonClose from "@/shared/ButtonClose";
import Logo from "@/shared/Logo";
import { Disclosure } from "@headlessui/react";
import { NavItemType } from "./NavigationItem";
import { NAVIGATION_DEMO } from "@/data/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import SocialsList from "@/shared/SocialsList";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import Link from "next/link";
import LangDropdown from "@/app/(client-components)/(Header)/LangDropdown";
import { ArrowLeftOnRectangleIcon as OutlineLogout } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/features/usersSlice";
import { signOut } from "next-auth/react";
import { RootState } from "@/redux/store";
import LoginBar from "@/shared/LoginBar";
import ButtonSecondary from "../ButtonSecondary";
import priceConversion from "@/utils/priceConversion";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION_DEMO,
  onClickClose,
}) => {
  const dispatch = useDispatch();
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );

  const [walletBalance, setWalletBalance] = useState({balance: 0})

  const handleLogout = async() => {
    await signOut()
    await localStorage.removeItem("random-string");
    await dispatch(logoutUser() as any);
  };


  
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

  const _renderMenuChild = (item: NavItemType) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <Link
              href={{
                pathname: i.href || undefined,
              }}
              className="flex px-4 text-neutral-900 dark:text-neutral-200 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-0.5"
            >
              <span
                className={`py-2.5 pr-3 ${!i.children ? "block w-full" : ""}`}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex-1 flex"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="py-2.5 flex justify-end flex-1"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-neutral-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </Link>
            {i.children && (
              <Disclosure.Panel>{_renderMenuChild(i)}</Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType, index: number) => {
    return (
      <Disclosure
        key={item.id}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <Link
          className="flex w-full px-4 font-medium uppercase tracking-wide text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          href={{
            pathname: item.href || undefined,
          }}
        >
          <span
            className={`py-2.5 pr-3 ${!item.children ? "block w-full" : ""}`}
          >
            {item.name}
          </span>
          {item.children && (
            <span className="flex-1 flex" onClick={(e) => e.preventDefault()}>
              <Disclosure.Button
                as="span"
                className="py-2.5 flex items-center justify-end flex-1 "
              >
                <ChevronDownIcon
                  className="ml-2 h-4 w-4 text-neutral-500"
                  aria-hidden="true"
                />
              </Disclosure.Button>
            </span>
          )}
        </Link>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  return (
    <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-6 px-5">
        <Logo
          imgLight={process.env.NEXT_PUBLIC_COMPANY_LOGO}
          img={process.env.NEXT_PUBLIC_COMPANY_LOGO}
        />
        <div className="flex flex-col mt-5 text-neutral-700 dark:text-neutral-300 text-sm">

          <div className="flex justify-between items-center mt-4">
            <SocialsList itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300" />
            <span className="block">
              <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
            </span>
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col py-6 px-2 space-y-1">
        {data.map(_renderItem)}
        {user?.name && jwtToken && (
          <>
          <div className="pt-5">

          <div
          className="container dark:bg-neutral-700 bg-gray-100 rounded py-1 flex justify-between"
          >
            <p>Available Wallet Balance</p>
            <p className="font-semibold">{priceConversion(walletBalance?.balance, selectedCurrency, true)}</p>
          </div>
            </div>
        <div
          onClick={handleLogout}
          className="flex gap-1 items-center text-center cursor-pointer py-6 px-2 space-y-1"
          >
          <OutlineLogout className="h-6 w-6" />

          <span className="text-neutral-6000 dark:text-neutral-300">
            Logout
          </span>
        </div>
          </>
)}

{!user?.name && (
          <ButtonSecondary
          className="flex gap-1 w-fit border-none items-center text-center cursor-pointer px-2"
          href="/login">
          <UserCircleIcon className="h-6 w-6" />

<span className="text-neutral-6000 dark:text-neutral-300">
  Login
</span>
          </ButtonSecondary>
)}
      </ul>
      <div className="flex items-center justify-end py-6 px-5">
        <LangDropdown
          className="flex"
          panelClassName="z-10 w-screen max-w-[350px] px-4 mb-3 right-3 bottom-full sm:px-0"
        />
      </div>
    </div>
  );
};

export default NavMobile;
