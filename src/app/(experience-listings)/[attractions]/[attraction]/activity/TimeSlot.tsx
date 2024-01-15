import React, { useState, Fragment, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { usePathname } from "next/navigation";
import priceConversion from "@/utils/priceConversion";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ActivityExcursion } from "@/data/attraction/types";

export interface TimeSlotProps {
    className?: string;
    iconClassName?: string;
    data?: ActivityExcursion,
    handleChangeData?: (keyName: string, value: any) => void
}
const TimeSlot: React.FC<TimeSlotProps> = ({
    className = "p-2 rounded-lg text-neutral-100 dark:text-neutral-300 bg-blue-600",
    iconClassName = "h-8 w-8",
    data,
    handleChangeData
}) => {
    const [isVisable, setIsVisable] = useState(false);

    const pathname = usePathname();

    const { selectedCurrency } = useSelector((state: RootState) => state.initials)

    useEffect(() => {
        setIsVisable(false);
    }, [pathname]);

    const handleOpenMenu = () => setIsVisable(true);
    const handleCloseMenu = () => setIsVisable(false);

    const renderContent = () => {
        return (
            <Transition appear show={isVisable} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={handleCloseMenu}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full  items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-screen-md transform overflow-hidden rounded-2xl bg-white  dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6  pb-2 flex justify-between"
                                    >
                                        <span className="cursor-default ">Slots</span>
                                        <span onClick={handleCloseMenu} className="cursor-pointer">

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                    </Dialog.Title>
                                    <hr />
                                    <div className=" my-4 max-h-[70vh] overflow-y-auto  w-full">
                                        {data?.slotsAvailable && data?.slotsAvailable?.length > 0 ? (

                                            <div className="grid grid-cols-2 gap-3 relative">
                                                {data?.slotsAvailable?.map((slot) => (
                                                    <div
                                                        key={slot?.EventID}
                                                        onClick={() => {
                                                            if (Number(slot?.Available) >= data?.adultCount) {
                                                                if (handleChangeData) {
                                                                    handleChangeData("slot", slot)
                                                                    handleCloseMenu()
                                                                }
                                                            }
                                                        }}
                                                        className={` ${Number(slot?.Available) < data?.adultCount
                                                            ? " border-red-500/20 text-stone-500  "
                                                            : slot?.EventID === data.slot?.EventID
                                                                ? " border-green-500/20 bg-green-100/50 dark:bg-transparent dark:border-green-700  "
                                                                : " border-green-500/20 "
                                                            } relative border-4 rounded  w-full pt-2 shadow-md flex flex-col items-center justify-center cursor-pointer`}
                                                    >
                                                        {slot?.EventID === data.slot?.EventID ? (

                                                            <p className="text-sm text-green-600 font-mono pb-2">
                                                                <i className="lar la-check-circle text-sm"></i>
                                                                <span className="pl-1 text-xs">Selected</span>
                                                            </p>
                                                        ) : ""}
                                                        <p className="text-xs">
                                                            {format(new Date(slot?.StartDateTime), "d MMM, yyyy") +
                                                                " TO " +
                                                                format(new Date(slot?.EndDateTime), "d MMM, yyyy")}
                                                        </p>
                                                        <div className="md:flex  gap-1 ">
                                                            <p className="text-xs flex  gap-1">
                                                                <span className="text-sm">
                                                                    <i className="las la-male"></i>
                                                                </span>
                                                                {priceConversion(
                                                                    Number(slot?.AdultPrice),
                                                                    selectedCurrency,
                                                                    true
                                                                )}
                                                            </p>
                                                            <p className="text-xs flex gap-1">
                                                                <span className="text-sm">
                                                                    <i className="las la-baby"></i>
                                                                </span>{" "}
                                                                {priceConversion(
                                                                    Number(slot?.ChildPrice),
                                                                    selectedCurrency,
                                                                    true
                                                                )}
                                                            </p>
                                                        </div>
                                                        {slot?.EventID === data.slot?.EventID ? (
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (handleChangeData) {
                                                                        handleChangeData("slot", {})
                                                                    }
                                                                }}
                                                                className="absolute bg-red-500 text-white h-5 w-5 rounded-full -top-1 right-1 flex gap-1 justify-center items-center"
                                                            >
                                                                <i className="las la-ban text-lg font-semibold"></i>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        ) : ""}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    return (
        <>
            <button
                onClick={handleOpenMenu}
                className={`focus:outline-none cursor-pointer  px-4 ${className}`}
            >
                {data?.slot?.EventID?.length ? "Update Selected Slot " : "Choose Time Slot"}
            </button>

            {renderContent()}
        </>
    );
};

export default TimeSlot;
