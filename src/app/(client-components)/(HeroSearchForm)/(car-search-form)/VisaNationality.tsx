"use client";

import {
  ClockIcon,
  HomeModernIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "../ClearDataButton";
import { QueryAttractions, QueryDestinations } from "@/data/attraction/types";
import { useDispatch, useSelector } from "react-redux";
import { setInitialData } from "@/redux/features/visaSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { Route } from "next";

interface SetQueryFunction {
  (query: string): void;
}

interface QueryResponseData {
  attractions?: QueryAttractions[] | [];
  destinations?: QueryDestinations[] | [];
  totalDestination?: number;
  totalAttraction?: number;
}

interface Nationality {
  _id: string;
  nationality: string;
  slug: string;
}

export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  setQuery?: SetQueryFunction;
  data?: QueryResponseData;
  setVisaNationality?: (value: string) => void;
  Nationality?: string;
  setIsNationality?: (value: string) => void;
  visaDestination?: string;
}

const VisaNationality: FC<LocationInputProps> = ({
  autoFocus = false,
  placeHolder = "Location",
  desc = "Where are you going?",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  setQuery,
  data,
  setVisaNationality,
  setIsNationality,
  visaDestination,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const route = useRouter();

  const [value, setValue] = useState("");
  const [nationalityString, setNationalityString] = useState<string>("");
  const [nationality, setNationality] = useState([]);
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [showValue, setShowValue] = useState("");
  const dispatch = useDispatch();

  const { Nationality } = useSelector((state: RootState) => state.visa);

  useEffect(() => {
    {
      Nationality !== "" &&
        route.push(
          `/visa/${visaDestination}?nationality=${Nationality}` as Route
        );
    }
  }, [nationalityString, Nationality, visaDestination]);

  if (setQuery) {
    setQuery(value);
  }

  useEffect(() => {
    setShowPopover(autoFocus);
  }, [autoFocus]);

  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    showPopover && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopover]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setShowPopover(false);
  };

  const handleSelectLocation = (item: string) => {
    setValue(item);
    dispatch(setInitialData({ Nationality: item }));
    setNationalityString(item);
    setShowPopover(false);
    setIsNationality?.(item);
  };

  const visaNationality = async () => {
    try {
      const nationality = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/all/nationality`
      );
      return nationality.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaNationality() {
    try {
      const response = await visaNationality();
      {
        response?.map((nationality: any, index: number) =>
          setValue(nationality?.nationality)
        );
      }

      setNationality(response);

      // You can also do further processing with the response data here.
    } catch (error) {
      console.error(error);
    }
  }

  // Call the function to get and log the API response.

  useEffect(() => {
    getVisaNationality();
  }, []);

  useEffect(() => {
    setVisaNationality?.(value);
  }, [value]);

  // useEffect(() => {
  //   {!Nationality && (
  //   dispatch(setInitialData({ Nationality: "india" }))
  //   )}
  // },[])
  

  const renderRecentSearches = (value: string, nationality: Nationality[]) => {
    return (
      <>
        {value?.length > 0 && (
          <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
            Popular Destinations
          </h3>
        )}
        <div className="mt-2">
          {nationality
            ?.filter((item) =>
              item?.nationality.toLowerCase().includes(showValue.toLowerCase())
            )
            ?.map((item) => (
              <span
                onClick={() => handleSelectLocation(item?.slug)}
                key={item?._id}
                className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <span className="block text-neutral-400">
                  <MapPinIcon className="h-4 sm:h-6 w-4 sm:w-6" />
                </span>
                <span className=" block font-medium text-neutral-700 dark:text-neutral-200 capitalize">
                  {item?.nationality}
                </span>
              </span>
            ))}
        </div>
      </>
    );
  };

  const renderSearchValue = () => {
    return (
      <>
        {data?.attractions &&
          data?.attractions?.map((item) => (
            <span
              onClick={() => handleSelectLocation(item?.slug)}
              key={item?._id}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <HomeModernIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700 dark:text-neutral-200 capitalize">
                {item?.title}
              </span>
            </span>
          ))}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${
          showPopover ? "nc-hero-field-focused" : ""
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate capitalize`}
            placeholder={Nationality || placeHolder}
            value={showValue}
            autoFocus={showPopover}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              setShowValue(e.currentTarget.value);
            }}
            ref={inputRef}
          />
          {/* <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span> */}
          {value && (
            <ClearDataButton
              onClick={() => {
                setValue("");
                setShowValue("");
              }}
            />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 md:bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value?.length > 2 ? (
            <>
              {renderRecentSearches(value, nationality)}
              {renderSearchValue()}
            </>
          ) : (
            renderRecentSearches(value, nationality)
          )}
        </div>
      )}
    </div>
  );
};

export default VisaNationality;
