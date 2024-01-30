"use client";

import { ActivityExcursion, TransferTypeEmun } from "@/data/attraction/types";
import { Popover, Transition } from "@headlessui/react";
import { TruckIcon } from "@heroicons/react/24/outline";
import React, { FC, Fragment } from "react";

export interface TransferInputProps {
  desc?: string;
  className?: string;
  data: ActivityExcursion;
  handleChangeData: (param1: string, param2: any) => void;
}

const TransferInput: FC<TransferInputProps> = ({
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
            className={`w-full flex items-center justify-between p-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700  focus:outline-none ${open ? " shadow-lg " : ""
              }`}
          >
            <div className="flex items-center gap-1">
              {/* <div className="text-neutral-300 dark:text-neutral-400">
                <TruckIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div> */}
              <div className="capitalize text-[11px]">
                {data.transferType + " Transfer"}
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
                <div className="w-full relative flex flex-col divide-y text-sm">
                  {data.activityType !== "transfer" && (
                    <div
                      onClick={() => {
                        handleChangeData(
                          "transferType",
                          TransferTypeEmun.without
                        );
                        close();
                      }}
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-6000 px-5 py-3 transition-all duration-200"
                    >
                      Without Transfer
                    </div>
                  )}
                  {data?.isPrivateTransferAvailable &&
                    data.privateTransfers && (
                      <div
                        onClick={() => {
                          handleChangeData(
                            "transferType",
                            TransferTypeEmun.private
                          );
                          close();
                        }}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-6000 px-5 py-3 transition-all duration-200"
                      >
                        Private Transfer
                      </div>
                    )}
                  {data?.isSharedTransferAvailable &&
                    data.sharedTransferPrice && (
                      <div
                        onClick={() => {
                          handleChangeData(
                            "transferType",
                            TransferTypeEmun.shared
                          );
                          close();
                        }}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-6000 px-5 py-3 transition-all duration-200"
                      >
                        Shared Transfer
                      </div>
                    )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default TransferInput;
