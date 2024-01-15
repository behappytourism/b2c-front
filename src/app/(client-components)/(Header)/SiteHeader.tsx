"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  ShoppingBagIcon as ShoppingCartIcon,
  Cog8ToothIcon as CogIcon,
} from "@heroicons/react/24/outline";
import { Popover, Tab, Transition } from "@headlessui/react";
import { PathName } from "@/routers/types";
import Link from "next/link";
import Header from "./Header";
import Header3 from "./Header3";
import { usePathname } from "next/navigation";
import { useThemeMode } from "@/utils/useThemeMode";
import LangDropdown from "./LangDropdownSingle";
import CurrencyDropdown from "./CurrencyDropdown";
import Image from "next/image";
import { changeCurrencyInitials } from "@/redux/features/initialsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Route } from "next";
import Button from "@/shared/Button";

export type SiteHeaders = "Header 1" | "Header 2" | "Header 3";

interface HomePageItem {
  name: string;
  slug: PathName;
}

let OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};
let OBSERVER: IntersectionObserver | null = null;
const PAGES_HIDE_HEADER_BORDER: PathName[] = [
  "/home-3" as Route,
  "/listing-car-detail" as Route,
  "/listing-experiences-map" as Route,
  "/listing-stay-detail" as Route,
];


export const headerLanguage = [
  {
    id: "English",
    name: "English",
    description: "United State",
    active: true,
  },
];


const SiteHeader = () => {
  const anchorRef = useRef<HTMLDivElement>(null);

  const { globalData } = useSelector((state: RootState) => state.initials)

  const [isTopOfPage, setIsTopOfPage] = useState(true);

  useEffect(() => {
    setIsTopOfPage(window.pageYOffset < 5);
  }, []);
  //
  useThemeMode();
  //
  const pathname = usePathname();

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      setIsTopOfPage(entry.isIntersecting);
    });
  };

  useEffect(() => {
    // disconnect the observer
    // observer for show the LINE bellow header
    if (!PAGES_HIDE_HEADER_BORDER.includes(pathname as PathName)) {
      OBSERVER && OBSERVER.disconnect();
      OBSERVER = null;
      return;
    }
    if (!OBSERVER) {
      OBSERVER = new IntersectionObserver(intersectionCallback, OPTIONS);
      anchorRef.current && OBSERVER.observe(anchorRef.current);
    }
  }, [pathname]);

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const renderLang = (close: () => void) => {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        {headerLanguage.map((item, index) => (
          <a
            key={index}
            onClick={() => close()}
            className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${item.active ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"
              }`}
          >
            <div className="">
              <p className="text-sm font-medium ">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const dispatch = useDispatch<AppDispatch>()

  const { currencies, selectedCurrency } = useSelector((state: RootState) => state.initials);


  const renderCurr = (close: () => void) => {
    return (
      <div className="flex flex-col gap-2">

        {currencies.length && currencies?.map((currency) => (
          <div
            onClick={() => {
              dispatch(changeCurrencyInitials({
                isocode: currency?.isocode,
                conversionRate: currency?.conversionRate,
                flag: currency?.country?.flag,
              }))
            }}
            key={currency?._id}
            className={`flex items-center gap-3 px-5 py-3  rounded-xl cursor-pointer ${selectedCurrency.isocode === currency.isocode ? " bg-green-200 shadow-md dark:bg-blue-600 " : " hover:bg-gray-100 dark:hover:bg-neutral-700 "}`}>
            <div className="">
              <Image
                alt="Currency"
                className="object-cover rounded "
                src={currency?.country?.flag || ""}
                width={30}
                height={20}
              />
            </div>
            <div className="capitalize">{currency?.country?.countryName} / {currency?.isocode}</div>
          </div>
        ))}
      </div>
    );
  };






  // FOR DEMO PAGE
  const renderControlSelections = () => {
    return (
      <div className="ControlSelections relative z-40 hidden lg:block">
        <div className="fixed right-3 top-1/4 z-40 flex flex-col  gap-2 items-center">
          <Popover className="relative">
            {({ open, close }) => (
              <>
                <Popover.Button
                  className={`p-2.5 bg-white hover:bg-neutral-100 dark:bg-primary-6000 dark:hover:bg-primary-700 rounded-xl shadow-xl border border-neutral-200 dark:border-primary-6000 z-10 focus:outline-none ${open ? " focus:ring-2 ring-primary-500" : ""
                    }`}
                >
                  <CogIcon className="w-8 h-8" />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className={`absolute z-20 right-0 mt-2 w-[400px]`}>
                    <div className="p-3 sm:p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5">
                      <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-full bg-gray-100 dark:bg-slate-700 p-1">
                          {["Language", "Currency"].map((category) => (
                            <Tab
                              key={category}
                              className={({ selected }) =>
                                classNames(
                                  "w-full rounded-full py-2 text-sm font-medium leading-5 text-gray-700",
                                  "focus:outline-none focus:ring-0",
                                  selected
                                    ? "bg-white shadow"
                                    : "text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40"
                                )
                              }
                            >
                              {category}
                            </Tab>
                          ))}
                        </Tab.List>
                        <Tab.Panels className="mt-5">
                          <Tab.Panel
                            className={classNames(
                              "rounded-xl p-3",
                              "focus:outline-none focus:ring-0"
                            )}
                          >
                            {renderLang(close)}
                          </Tab.Panel>
                          <Tab.Panel
                            className={classNames(
                              "rounded-xl p-3",
                              "focus:outline-none focus:ring-0"
                            )}
                          >
                            {renderCurr(close)}
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <div className="relative">
            <a
              target="_blank"
              rel="noopener noreferrer"
              title={"Whatsapp"}
              href={`https://wa.me/${globalData?.home?.phoneNumber2}`}>
              <div
                className={`p-2.5 flex items-center justify-center bg-white hover:bg-neutral-100 dark:bg-primary-6000 dark:hover:bg-primary-700 rounded-xl shadow-xl border border-neutral-200 dark:border-primary-6000 z-10 focus:outline-none `}
              >
                <i className="lab la-whatsapp h-8 w-8 text-3xl text-green-600"></i>
              </div>
            </a>
          </div>
        </div>
      </div >
    );
  };

  const renderHeader = () => {
    let headerClassName = "shadow-sm dark:border-b dark:border-neutral-700";
    // if (PAGES_HIDE_HEADER_BORDER.includes(pathname as PathName)) {
    //   headerClassName = isTopOfPage
    //     ? ""
    //     : "shadow-sm dark:border-b dark:border-neutral-700";
    // }
    // switch (headerSelected) {
    //   case "Header 1":
    return <Header className={headerClassName} navType="MainNav1" />;
    //   case "Header 2":
    // return <Header className={headerClassName} navType="MainNav2" />;
    //   case "Header 3":
    //     return <Header3 className={headerClassName} />;

    //   default:
    // return <Header3 className={headerClassName} />;
    // }
  };

  return (
    <>
      {renderControlSelections()}
      {renderHeader()}
      <div ref={anchorRef} className="h-1 absolute invisible"></div>
    </>
  );
};

export default SiteHeader;
