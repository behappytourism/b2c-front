import React, { Fragment, FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { GuestsObject } from "@/app/(client-components)/type";
import { ActivityExcursion } from "@/data/attraction/types";

export interface GuestsInputProps {
  className?: string;
  data: ActivityExcursion;
  handleChangeData: (param1: string, param2: any) => void;
}

const GuestsInput: FC<GuestsInputProps> = ({
  className = "flex-1",
  data,
  handleChangeData,
}) => {
  const handleChangeGuestData = (value: number, type: keyof GuestsObject) => {
    if (type === "guestAdults") {
      handleChangeData("adultCount", value);
    }
    if (type === "guestChildren") {
      handleChangeData("childCount", value);
    }
    if (type === "guestInfants") {
      handleChangeData("infantCount", value);
    }
  };

  return (
    <Popover className={`flex relative ${className}`}>
      {({ open }) => (
        <>
          <div
            className={`flex-1 flex items-center focus:outline-none rounded-3xl border ${
              open ? "shadow-lg" : ""
            }`}
          >
            <Popover.Button
              className={`relative z-10 flex-1 flex text-left items-center p-3 space-x-3 focus:outline-none`}
            >
              <div className="text-neutral-300 dark:text-neutral-400">
                <UserPlusIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="flex-grow text-base divide-x-2 divide-gray-300">
                <span className=" pr-1">{data.adultCount + " Adult "}</span>
                {data.childCount ? (
                  <span className=" px-1">
                    {data.childCount + " Children "}
                  </span>
                ) : (
                  ""
                )}
                {data.infantCount ? (
                  <span className=" pl-1">{data.infantCount + " Infant"}</span>
                ) : (
                  ""
                )}
              </div>
            </Popover.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-700 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl ring-1 ring-black ring-opacity-5 ">
              <NcInputNumber
                className="w-full"
                defaultValue={data.adultCount}
                onChange={(value) =>
                  handleChangeGuestData(value, "guestAdults")
                }
                max={100}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
              />
              <NcInputNumber
                className="w-full mt-6"
                defaultValue={data.childCount}
                onChange={(value) =>
                  handleChangeGuestData(value, "guestChildren")
                }
                max={4}
                label="Children"
                desc="Ages 2–12"
              />

              <NcInputNumber
                className="w-full mt-6"
                defaultValue={data.infantCount}
                onChange={(value) =>
                  handleChangeGuestData(value, "guestInfants")
                }
                max={4}
                label="Infants"
                desc="Ages 0–2"
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;
