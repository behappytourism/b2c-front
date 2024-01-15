"use client";

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  CurrencyDollarIcon,
  CurrencyBangladeshiIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
  CurrencyRupeeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import Image from "next/image";
import { changeCurrencyInitials } from "@/redux/features/initialsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

export const headerCurrency = [
  {
    id: "EUR",
    name: "EUR",
    href: "##",
    icon: CurrencyEuroIcon,
    active: true,
  },
  {
    id: "USD",
    name: "USD",
    href: "##",
    icon: CurrencyDollarIcon,
  },
  {
    id: "GBF",
    name: "GBF",
    href: "##",
    icon: CurrencyBangladeshiIcon,
  },
  {
    id: "SAR",
    name: "SAR",
    href: "##",
    icon: CurrencyPoundIcon,
  },
  {
    id: "QAR",
    name: "QAR",
    href: "##",
    icon: CurrencyRupeeIcon,
  },
];

export default function CurrencyDropdown() {
  const dispatch = useDispatch<AppDispatch>()

  const { currencies, selectedCurrency } = useSelector((state: RootState) => state.initials);
  return (
    <div className="CurrencyDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-80"}
                group px-3 py-1.5 border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 rounded-full inline-flex items-center text-sm text-gray-700 dark:text-neutral-300 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <BanknotesIcon className="w-5 h-5 opacity-80" />
              <span className="ml-2 select-none">Currency</span>
              <ChevronDownIcon
                className={`${open ? "-rotate-180" : "text-opacity-70"}
                  ml-2 h-4 w-4  group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel
                                    static
                                    className="absolute right-0 z-10 top-full w-screen max-w-xs bg-white dark:bg-neutral-800 rounded-xl shadow-xl border dark:border-neutral-700 overflow-hidden"
                                >
                                    {currencies.length && currencies?.map((currency) => (
                                        <div
                                            onClick={() => {
                                                dispatch(changeCurrencyInitials({
                                                    isocode: currency?.isocode,
                                                    conversionRate: currency?.conversionRate,
                                                    flag: currency?.country?.flag,
                                                }))
                                                close()
                                            }}
                                            key={currency?._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                                            <div className="">
                                                <Image
                                                    alt="Currency"
                                                    className="object-cover rounded "
                                                    src={currency?.country?.flag || ""}
                                                    width={30}
                                                    height={20}
                                                />
                                            </div>
                                            <div className="capitalize">{currency?.country?.countryName} {currency?.currencyName}</div>
                                        </div>
                                    ))}
                                </Popover.Panel>
                            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
