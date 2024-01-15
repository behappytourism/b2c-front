"use client"

import { changeCurrencyInitials } from "@/redux/features/initialsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { FC, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
interface CurrencySelectorProps {
    className: string
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ className }) => {

    const dispatch = useDispatch<AppDispatch>()

    const { currencies, selectedCurrency } = useSelector((state: RootState) => state.initials);

    return (
        <React.Fragment>
            <Popover className={`relative ${className}`}>
                {({ open, close }) => {
                    return (
                        <>
                            <Popover.Button className="text-2xl md:text-[28px] w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
                                <Image
                                    alt="Currency"
                                    className="object-cover rounded "
                                    src={selectedCurrency?.flag || ""}
                                    width={32}
                                    height={22}
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
                                            <div className="capitalize">{currency?.country?.countryName}  / {currency?.isocode}</div>
                                        </div>
                                    ))}
                                </Popover.Panel>
                            </Transition>
                        </>
                    );
                }}
            </Popover>
        </React.Fragment>
    )
}

export default CurrencySelector