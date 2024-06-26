"use client";

import { ActivityExcursion, TransferTypeEmun } from "@/data/attraction/types";
import { Popover, Transition } from "@headlessui/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import React, { FC, Fragment } from "react";

export interface HourInputProps {
    desc?: string;
    className?: string;
    data: ActivityExcursion;
    handleChangeData: (param1: string, param2: any) => void;
}

const HourInput: FC<HourInputProps> = ({
    data,
    handleChangeData,
    desc = "Where are you going?",
    className = "nc-flex-1.5",
}) => {
    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={`w-fit flex items-center gap-5 p-1.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700  focus:outline-none ${open ? " shadow-lg " : ""
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            <div className="text-neutral-300 dark:text-neutral-400">
                                <ClockIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="capitalize text-[12px]">
                                {data.hourCount + " Hour"}
                            </div>
                        </div>
                        <i className="las la-angle-down ml-2"></i>
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
                        <Popover.Panel className="absolute z-20 w-screen max-w-sm  mt-3 left-0 sm:px-0 ">
                            <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 ">
                                <div className="w-full relative flex flex-col divide-y text-sm max-h-[300px] overflow-y-auto">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                handleChangeData(
                                                    "hourCount",
                                                    i + 1
                                                );
                                                close();
                                            }}
                                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-6000 px-5 py-3 transition-all duration-200"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default HourInput;
