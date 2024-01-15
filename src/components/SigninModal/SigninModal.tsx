"use client";

import React, { useState } from "react";
import ButtonClose from "@/shared/ButtonClose";
import Logo from "@/shared/Logo";
import { Disclosure } from "@headlessui/react";
import { NavItemType } from "@/shared/Navigation/NavigationItem";
import { NAVIGATION_DEMO } from "@/data/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import SocialsList from "@/shared/SocialsList";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import SwitchDarkMode from "@/shared/SwitchDarkMode";
import Link from "next/link";
import LangDropdown from "@/app/(client-components)/(Header)/LangDropdown";
import PageLogin from "@/app/login/page";
import PageSignUp from "@/app/signup/page";
import ModalLogin from "@/app/login/ModalLogin";
import ModalSignUp from "@/app/signup/ModalSignup";

export interface NavMobileSigninProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const SigninModal: React.FC<NavMobileSigninProps> = ({
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
    <div className="bg-cover bg-center backdrop-filter backdrop-blur-sm h-full -mt-11 w-full flex fixed  justify-center z-50 py-1 transition transform dark:ring-neutral-700 dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      {tab === "login" && (
        <>
          <div className="bg-white shadow-xl border rounded-xl max-w-[400px] p-4 min-w-[400px] max-h-[550px] min-h-[550px] overflow-x-auto">
            <ModalLogin />
            <span className="block cursor-pointer mt-1 text-center text-neutral-700 dark:text-neutral-300">
              New user? {` `}
              <div
                onClick={() => setTab("signup")}
                className="font-semibold underline"
              >
                Create an account
              </div>
            </span>
          </div>
        </>
      )}
      {tab === "signup" && (
        <>
          <div className="bg-white shadow-xl border rounded-xl max-w-[400px] p-4 min-w-[400px] max-h-[550px] min-h-[550px] overflow-x-auto">
            <ModalSignUp />
            <span className="block cursor-pointer mt-1 text-center text-neutral-700 dark:text-neutral-300">
              Already have an account? {` `}
              <div
                onClick={() => setTab("login")}
                className="font-semibold underline"
              >
                Sign in
              </div>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SigninModal;
