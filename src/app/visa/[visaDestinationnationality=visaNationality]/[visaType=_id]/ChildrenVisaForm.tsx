"use client";

import React, { FC, Fragment, useEffect, useState } from "react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import Image from "next/image";
import {
  Amenities_demos,
  includes_demo,
  PHOTOS,
} from "@/app/(listing-detail)/listing-car-detail/constant";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SectionDateRange from "@/app/(listing-detail)/SectionDateRange";
import RentalCarDatesRangeInput from "@/app/(listing-detail)/listing-car-detail/RentalCarDatesRangeInput";
import { Route } from "next";
import { Tab } from "@headlessui/react";
import StayCard from "@/components/StayCard";
import {
  DEMO_CAR_LISTINGS,
  DEMO_EXPERIENCES_LISTINGS,
  DEMO_STAY_LISTINGS,
} from "@/data/listings";
import CarCard from "@/components/CarCard";
import ExperiencesCard from "@/components/Attraction/ExperiencesCard";
import RentalCarSearchForm from "@/app/(client-components)/(HeroSearchForm)/(car-search-form)/RentalCarSearchForm";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChildDOB,
  handleChildPPExpiry,
  updateChildTraveller,
} from "@/redux/features/visaSlice";
import { RootState } from "@/redux/store";

export interface ListVisaDetailPage {
  index: number;
  visaNationality: string;
  visaCountryId: string;
}

interface VisaTC {
  details?: {
    title: string;
    body: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  termsAndConditions?: string;
}

interface VisaDetails {
  _id: string;
  id: string | number;
  date: string;
  visaName: string;
  adultPrice: number;
  childPrice: number;
  ageTo: number;
  ageFrom: number;
  href: Route<string>;
  title: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  price: string;
  seats: number;
  gearshift: string;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}

const ChildrenVisaForm: FC<ListVisaDetailPage> = ({
  index,
  visaNationality,
  visaCountryId,
}) => {
  const thisPathname = usePathname();
  const router = useRouter();
  const [visaDetails, setVisaDetails] = useState<VisaDetails[] | null>(null);
  const [visaTC, setVisaTC] = useState<VisaTC | null>(null);
  const [visaDestination, setVisaDestination] = useState("");
  const [visaId, setVisaId] = useState("");
  const [noOfAdults, setNoOfAdults] = useState(1);
  const [noOfChilds, setNoOfChilds] = useState(0);
  const [contactValue, setContactValue] = useState("");
  const { countries } = useSelector((state: RootState) => state.initials);

  const [paxphoneCode, setPaxPhoneCode] = useState<string>("");

  useEffect(() => {
    const filteredCountries = countries?.filter(
      (countryItem) => countryItem?._id === visaCountryId
    );

    const filteredPaxPhoneCode = filteredCountries[0]?.phonecode;

    setPaxPhoneCode(filteredPaxPhoneCode || "");
  }, [countries, visaCountryId]);

  const dispatch = useDispatch();

  const { childTraveller } = useSelector((state: RootState) => state.visa);

  const filteredChildTraveller = childTraveller.find(
    (traveller, i) => i === index
  );

  useEffect(() => {
    {
      visaCountryId &&
        dispatch(
          updateChildTraveller({
            index,
            field: "country",
            value: visaCountryId,
          })
        );
    }
  }, []);

  let limit = new Date().getFullYear();
  let year: number[] = [];
  let expiryYear: number[] = [];
  for (let i = limit; i <= limit + 100; i++) {
    expiryYear.push(i);
  }
  for (let i = limit; i > limit - 100; i--) {
    year.push(i);
  }

  let day: number[] = [];
  for (let i = 1; i <= 31; i++) {
    day.push(i);
  }

  const monthNames = [
    {
      name: "January",
      value: 1,
    },
    {
      name: "February",
      value: 2,
    },
    {
      name: "March",
      value: 3,
    },
    {
      name: "April",
      value: 4,
    },
    {
      name: "May",
      value: 5,
    },
    {
      name: "June",
      value: 6,
    },
    {
      name: "July",
      value: 7,
    },
    {
      name: "August",
      value: 8,
    },
    {
      name: "September",
      value: 9,
    },
    {
      name: "October",
      value: 10,
    },
    {
      name: "November",
      value: 11,
    },
    {
      name: "December",
      value: 12,
    },
  ];

  const renderSidebarInquiry = () => {
    return (
      <div className="mt-4 p-5 rounded-lg border">
        <div className="flex justify-between">
          <span className="text-2xl pb-2 border-b font-semibold mb-5">Child</span>
        </div>

        <form>
          <>
            <div className="mb-2">
              <select
                // type="text"
                name="title"
                value={filteredChildTraveller?.title}
                required
                className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 p-1 text-primaryColor border rounded-xl border-gray-200 border-lightblue outline-none"
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  // Dispatch the action to update the Redux store
                  dispatch(
                    updateChildTraveller({
                      index: index,
                      field: "title",
                      value,
                    })
                  );
                }}
              >
                <option hidden>choose title</option>
                <option value={"mr"}>Mr.</option>
                <option value={"ms"}>Ms.</option>
                <option value={"mrs"}>Mrs.</option>
                <option value={"mstr"}>Mstr.</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label className="label font-semibold px-2">First Name</label>
                <div className="p-2 rounded-xl border  md:mb-2">
                  <input
                    className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
                    value={filteredChildTraveller?.firstName}
                    // autoFocus={showPopover}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Dispatch the action to update the Redux store
                      dispatch(
                        updateChildTraveller({
                          index: index,
                          field: "firstName",
                          value,
                        })
                      );
                    }}
                    // ref={inputRef}
                  />
                </div>
              </div>
              <div>
                <label className="label font-semibold px-2">Last Name</label>
                <div className="p-2 rounded-xl border  mb-2">
                  <input
                    className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
                    value={filteredChildTraveller?.lastName}
                    // autoFocus={showPopover}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Dispatch the action to update the Redux store
                      dispatch(
                        updateChildTraveller({
                          index: index,
                          field: "lastName",
                          value,
                        })
                      );
                    }}
                    // ref={inputRef}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label className="label font-semibold px-2">Email</label>
                <div className="p-2 rounded-xl border md:mb-2">
                  <input
                    className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate`}
                    value={filteredChildTraveller?.email}
                    // autoFocus={showPopover}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Dispatch the action to update the Redux store
                      dispatch(
                        updateChildTraveller({
                          index: index,
                          field: "email",
                          value,
                        })
                      );
                    }}
                    // ref={inputRef}
                  />
                </div>
              </div>
              <div>
                <label className="label font-semibold px-2">Nationality</label>
                <div className="p-2 rounded-xl border mb-2">
                  <input
                    className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
                    defaultValue={visaNationality}
                    disabled
                    // autoFocus={showPopover}
                    // onChange={(e) => {
                    //   setValue(e.currentTarget.value);
                    // }}
                    // ref={inputRef}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label className="label font-semibold px-2">
                  Contact Number
                </label>
                <div className="flex gap-2 p-2 rounded-xl border md:mb-2">
                <p className="border-r pl-2 items-center self-center flex justify-center pr-1">{paxphoneCode}</p>
                  <input
                    className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
                    value={filteredChildTraveller?.contactNo}
                    // autoFocus={showPopover}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      const phoneNumberRegex = /^[0-9]*$/;
                      // Dispatch the action to update the Redux store
                      if (phoneNumberRegex.test(value)) {
                        setContactValue(value);
                        dispatch(
                          updateChildTraveller({
                            index: index,
                            field: "contactNo",
                            value,
                          })
                        );
                      } else {
                      }
                    }}
                    // ref={inputRef}
                  />
                </div>
              </div>
              <div>
                <label className="label font-semibold px-2">
                  Passport Number
                </label>
                <div className="p-2 rounded-xl border  mb-2">
                  <input
                    className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
                    value={filteredChildTraveller?.passportNo}
                    // autoFocus={showPopover}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      // Dispatch the action to update the Redux store
                      dispatch(
                        updateChildTraveller({
                          index: index,
                          field: "passportNo",
                          value,
                        })
                      );
                    }}
                    // ref={inputRef}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="w-full">
                  <label className="label font-semibold px-2">
                    Date of Birth
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="">
                      <select
                        //type="number"
                        placeholder="Day"
                        className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
                        name="day"
                        value={filteredChildTraveller?.dateOfBirth?.day}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          // Dispatch the action to update the Redux store
                          dispatch(
                            handleChildDOB({
                              index: index,
                              field: "day",
                              value,
                            })
                          );
                        }}
                        required
                      >
                        <option hidden>Day</option>
                        {day.map((item: any, index: number) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="w-full">
                      <select
                        // type="number"
                        placeholder="Month"
                        className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
                        name="month"
                        value={filteredChildTraveller?.dateOfBirth?.month}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          // Dispatch the action to update the Redux store
                          dispatch(
                            handleChildDOB({
                              index: index,
                              field: "month",
                              value,
                            })
                          );
                        }}
                        required
                      >
                        <option hidden>Month</option>
                        {monthNames.map((item: any, index: number) => (
                          <option
                            key={index}
                            value={item.value}
                            className="capitalize"
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="">
                    <div className="w-full">
                      <select
                        // type="number"
                        className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
                        name="year"
                        value={filteredChildTraveller?.dateOfBirth?.year}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          // Dispatch the action to update the Redux store
                          dispatch(
                            handleChildDOB({
                              index: index,
                              field: "year",
                              value,
                            })
                          );
                        }}
                        required
                      >
                        <option hidden>Year</option>
                        {year.map((item: any, index: number) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="w-full">
                  <label className="label font-semibold px-2">
                    Passport Expiry
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="">
                      <select
                        //type="number"
                        placeholder="Day"
                        className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
                        name="day"
                        value={filteredChildTraveller?.expiryDate?.day}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          // Dispatch the action to update the Redux store
                          dispatch(
                            handleChildPPExpiry({
                              index: index,
                              field: "day",
                              value,
                            })
                          );
                        }}
                        required
                      >
                        <option hidden>Day</option>
                        {day.map((item: any, index: number) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="w-full">
                      <select
                        // type="number"
                        placeholder="Month"
                        className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
                        name="month"
                        value={filteredChildTraveller?.expiryDate?.month}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          // Dispatch the action to update the Redux store
                          dispatch(
                            handleChildPPExpiry({
                              index: index,
                              field: "month",
                              value,
                            })
                          );
                        }}
                        required
                      >
                        <option hidden>Month</option>
                        {monthNames.map((item: any, index: number) => (
                          <option
                            key={index}
                            value={item.value}
                            className="capitalize"
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="">
                    <div className="w-full">
                      <select
                        // type="number"
                        className="w-full dark:bg-gray-800 dark:border-gray-700 py-2 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
                        name="year"
                        value={filteredChildTraveller?.expiryDate?.year}
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          // Dispatch the action to update the Redux store
                          dispatch(
                            handleChildPPExpiry({
                              index: index,
                              field: "year",
                              value,
                            })
                          );
                        }}
                        required
                      >
                        <option hidden>Year</option>
                        {expiryYear.map((item: any, index: number) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </form>

        {/* <ButtonPrimary>Inquire Now</ButtonPrimary> */}
      </div>
    );
  };

  return <div>{renderSidebarInquiry()}</div>;
};

export default ChildrenVisaForm;
