"use client";

import React, { Fragment, useState, FC, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePicker from "react-datepicker";
import ClearDataButton from "@/app/(client-components)/(HeroSearchForm)/ClearDataButton";
import { addDays, format } from "date-fns";
import { ExcursionDetails } from "@/data/attraction/types";
import { useDispatch } from "react-redux";
import { handleDateChange } from "@/redux/features/attractionSlice";

export interface StayDatesRangeInputProps {
  className?: string;
  attraction?: ExcursionDetails
  setDate?: (date: Date | null) => void
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "flex-1",
  attraction,
  setDate
}) => {

  const [startDate, setStartDate] = useState<Date | null>(
    attraction && attraction.bookingPriorDays ? addDays(new Date(), Number(attraction.bookingPriorDays)) : addDays(new Date(), 1)
  );
   const dispatch = useDispatch();

  const handleDateOnclick = (date: Date | string) => {
    if (new Date(date) < new Date()) {
      return;
    }
    dispatch(handleDateChange(date));
  };

//Onchange setting date function.
const onChangeDate = (dates: Date | null) => {
  const formattedDate = dates ? formatDate(dates) : null; // Format the date
  console.log(formattedDate);
  
  dispatch(handleDateChange(formattedDate));
  setStartDate(dates ? new Date(dates) : dates);
  close();
};

// Function to format date as yyyy-MM-dd
const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

  useEffect(() => {
    if (setDate) {
      setDate(startDate)
    }
  }, [startDate])

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-700 dark:text-neutral-400 ">
          <CalendarIcon className="w-4 h-4 lg:w-4 lg:h-4" />
        </div>
        <div className="flex-grow text-left">
          <span className="block xl:text-xs">
            {startDate ? format(new Date(startDate), "MMM dd, yyyy") : "Add dates"}

          </span>
          {/* <span className="block mt-1 text-sm text-neutral-500 leading-none ">
            {"Travel Date"}
          </span> */}
        </div>
      </>
    );
  };

  return (
    <Popover className={`StayDatesRangeInput z-[11] relative flex ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex-1 flex relative p-2 items-center space-x-3 focus:outline-none ${open ? "shadow-lg" : ""
              }`}
          >
            {renderInput()}
            {startDate && open && (
              <ClearDataButton onClick={() => onChangeDate(new Date())} />
            )}
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
            <Popover.Panel className="absolute left-auto xl:-right-10 right-0 z-10 mt-3 top-full w-screen max-w-sm px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-8">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    onChangeDate(dates)
                    close()
                  }}
                  startDate={startDate}
                  minDate={attraction && attraction.bookingPriorDays ? addDays(new Date(), Number(attraction.bookingPriorDays)) : new Date()}
                  monthsShown={2}
                  showPopperArrow={false}
                  inline
                  renderCustomHeader={(p) => (
                    <DatePickerCustomHeaderTwoMonth {...p} />
                  )}
                  renderDayContents={(day, date) => (
                    <DatePickerCustomDay dayOfMonth={day} date={date} />
                  )}
                />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default StayDatesRangeInput;
