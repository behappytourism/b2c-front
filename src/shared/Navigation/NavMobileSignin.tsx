"use client";

import React, { useState } from "react";
import ButtonClose from "@/shared/ButtonClose";
import Logo from "@/shared/Logo";
import { Disclosure } from "@headlessui/react";
import { NavItemType } from "./NavigationItem";
import { NAVIGATION_DEMO } from "@/data/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import SocialsList from "@/shared/SocialsList";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import Link from "next/link";
import LangDropdown from "@/app/(client-components)/(Header)/LangDropdown";
import PageLogin from "@/app/login/page";
import PageSignUp from "@/app/signup/page";

export interface NavMobileSigninProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const NavMobileSignin: React.FC<NavMobileSigninProps> = ({
  data = NAVIGATION_DEMO,
  onClickClose,
}) => {
  const [tab, setTab] = useState("login");
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
    <div className="overflow-y-auto w-full h-screen py-1 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-2 px-5">
      <Logo imgLight={process.env.NEXT_PUBLIC_COMPANY_LOGO} img={process.env.NEXT_PUBLIC_COMPANY_LOGO} className="w-36 self-center" />
        <div className="flex flex-col mt-1 text-neutral-700 dark:text-neutral-300 text-sm"></div>
        <span className="absolute right-2 top-4 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      {tab === "login" && (
        <>
          <PageLogin />
          <span className="block md:hidden text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <div onClick={() => setTab("signup")} className="font-semibold underline">Create an account</div>
          </span>
        </>
      )}
      {tab === "signup" && (
        <>
      <PageSignUp />
      <span className="md:hidden block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <div onClick={() => setTab("login")} className="font-semibold underline">
              Sign in
            </div>
          </span>
      </>
      )}
      <div className="flex items-center justify-right py-6 px-5">
        <LangDropdown
          className="flex"
          panelClassName="z-10 w-screen max-w-[280px] px-4 mb-3  bottom-full sm:px-0"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <SocialsList itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300" />
        <span className="block">
          <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
        </span>
      </div>
    </div>
  );
};

export default NavMobileSignin;
