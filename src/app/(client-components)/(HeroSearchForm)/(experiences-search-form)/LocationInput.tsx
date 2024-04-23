"use client";

import {
  ClockIcon,
  HomeModernIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "../ClearDataButton";
import { QueryAttractions, QueryDestinations } from "@/data/attraction/types";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAttractionDestination } from "@/redux/features/attractionSlice";

interface QueryResponseData {
  attractions?: QueryAttractions[] | [];
  destinations?: QueryDestinations[] | [];
  totalDestination?: number;
  totalAttraction?: number;
}

export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  setQuery?: (query: string) => void;
  setDestination?: (destinationType: string) => void;
  data?: QueryResponseData;
  closeModal?: () => void
}

const LocationInput: FC<LocationInputProps> = ({
  autoFocus = false,
  placeHolder = "Select Location",
  desc = "Where are you going?",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  setQuery,
  setDestination,
  data,
  closeModal
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);
  const { Destination } = useSelector((state: RootState) => state.attraction);
  

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

  const handleSelectLocation = ({
    item,
    destination,
    title,
  }: {
    item: string;
    destination?: string;
    title?: string;
  }) => {
    if (destination && setDestination) {
      setDestination(destination);

    }
    setValue(item);
    dispatch(setAttractionDestination({ Destination: title }))
    if (title) {
      setShowValue(title);
    } else {
      setShowValue(item);
    }
    setShowPopover(false);
    if (closeModal) {
      closeModal()
    }
  };

  const renderRecentSearches = (value: string) => {
    return (
      <>
        {value?.length == 0 && (
          <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
            Popular Destinations
          </h3>
        )}
        <div className="mt-2">
          {data?.destinations &&
            data?.destinations.map((item) => (
              <span
                onClick={() => {
                  handleSelectLocation({
                    item: item?.name,
                  });
                  router.push(`/${item?.name}` as Route)
                }
                }
                key={item?._id}
                className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <span className="block text-neutral-400">
                  <MapPinIcon className="h-4 sm:h-6 w-4 sm:w-6" />
                </span>
                <span className=" block font-medium text-neutral-700 dark:text-neutral-200 capitalize">
                  {item?.name}
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
          data?.attractions.map((item) => (
            <span
              onClick={() => {
                handleSelectLocation({
                  item: item?.slug,
                  destination: item?.destination?.name,
                  title: item?.title,
                })
                router.push(`/${item?.destination?.name}/${item?.slug}` as Route)
              }
              }
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
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${showPopover ? "nc-hero-field-focused" : ""
          }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate capitalize`}
            placeholder={Destination || placeHolder}
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
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 md:bg-white z-0 dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value?.length > 0 ? (
            <>
              {renderRecentSearches(value)}
              {renderSearchValue()}
            </>
          ) : (
            renderRecentSearches(value)
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
