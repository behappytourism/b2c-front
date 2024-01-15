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
import { RootState } from "@/redux/store";
import { setAdult, setChild } from "@/redux/features/visaSlice";
import priceConversion from "@/utils/priceConversion";
import ErrorModal from "@/shared/Status/ErrorModal";

export interface ListVisaDetailPage {}

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

interface VisaOrderDetails {
  _id: string;
  country: string;
  firstName: string;
  visaName: string;
  visaPrice: number;
  lastName: string;
  dateOfBirth: {
    day: number;
    month: number;
    year: number;
  };
  expiryDate: {
    day: number;
    month: number;
    year: number;
  };
  passportNo: string;
}

interface VisaOrderDetailsProps {
  _id: string;
  totalPrice: number;
  firstName: string;
  visaName: string;
  createdAt: string;
  visaPrice: number;
  visa: {
    name: string;
  };
  lastName: string;
  dateOfBirth: {
    day: number;
    month: number;
    year: number;
  };
  expiryDate: {
    day: number;
    month: number;
    year: number;
  };
  passportNo: string;
}

const visaSuccess: FC<ListVisaDetailPage> = ({}) => {
  const thisPathname = usePathname();
  const router = useRouter();
  const [visaOrderId, setVisaOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedCurrency, countries } = useSelector(
    (state: RootState) => state.initials
  );
  const [visaOrderDetails, setVisaOrderDetails] =
    useState<VisaOrderDetailsProps | null>(null);
  const [visaOrderDate, setVisaOrderDate] =
    useState<VisaOrderDetailsProps | null>(null);
  const [visaOrderInvoice, setVisaOrderInvoice] = useState<null | Blob>(null);
  const [visaTravellerDetails, setVisaTravellerDetails] = useState<
    VisaOrderDetails[]
  >([]);
  const [error, setError] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const closeModal = () => {
    setError("");
  };

  const { jwtToken } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    const filteredCountry = countries?.filter((country) =>
      visaTravellerDetails?.some(
        (traveler) => traveler?.country === country?._id
      )
    );
    setCountry(filteredCountry[0]?.countryName || "");
  }, [visaTravellerDetails, countries]);

  useEffect(() => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const pathArray = url.pathname.split("/");
    const orderIdIndex = pathArray.indexOf("visa") + 2; // Assuming orderId is two positions after "visa"

    if (orderIdIndex < pathArray.length) {
      const orderId = pathArray[orderIdIndex];
      setVisaOrderId(orderId);
    }
  }, []);

  const fetchVisaPassenger = async (visaOrderId: string) => {
    try {
      const nationality = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/details/${visaOrderId}`
      );
      return nationality.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaPassenger(visaOrderId: string) {
    try {
      const response = await fetchVisaPassenger(visaOrderId);
      setVisaTravellerDetails(response?.travellers);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      visaOrderId && getVisaPassenger(visaOrderId);
    }
  }, [visaOrderId]);

  const fetchVisaDetails = async (visaOrderId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/invoice/${visaOrderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaDetails(visaOrderId: string) {
    try {
      const response = await fetchVisaDetails(visaOrderId);
      setVisaOrderDetails(response?.visaType);
      setVisaOrderDate(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      visaOrderId && getVisaDetails(visaOrderId);
    }
  }, [visaOrderId]);

  const fetchVisaInvoice = async (visaOrderId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/download/invoice/${visaOrderId}`,
        {
          headers: {
            "Content-Type": "arraybuffer",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.blob();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaInvoice(visaOrderId: string) {
    try {
      const response = await fetchVisaInvoice(visaOrderId);

      if (response) {
        setVisaOrderInvoice(response);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      visaOrderId && getVisaInvoice(visaOrderId);
    }
  }, [visaOrderId]);

  const handleDownload = () => {
    if (visaOrderInvoice) {
      const pdfBlob = new Blob([visaOrderInvoice], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "visainvoice.pdf";
      a.click();
    }
  };

  

  const renderSection2 = () => {
    return (
      <>
        <div className="listingSection__wrap">
          <div className="text text-center">
            <h1 className="text-3xl hidden md:block">
              THANK YOU FOR YOUR ORDER
            </h1>
            <h1 className="text-3xl md:hidden">
              THANK YOU <br /> FOR YOUR ORDER
            </h1>
            <p className="md:block hidden">
              Wohoo! Your payment was successful, and your order is complete.
            </p>
            <p className="md:block hidden">
              You will receive an confirmation message to your email.
            </p>
            <p className="md:hidden">
              Wohoo! Your payment was successful, <br /> and your order is
              complete.
            </p>
            {visaTravellerDetails.map((traveler, index) => (
              <div className="md:flex justify-center gap-10 mt-10">
                <div className="bg-primary-6000 text-white font-semibold md:w-8/12 p-4 rounded-xl">
                  <div className="md:flex md:justify-between text-left">
                    <div>
                      <p>{visaOrderDetails?.visaName}</p>
                      <p>{visaOrderDetails?.visa?.name}</p>

                      <div className="md:mt-8 mt-4">
                        <div className="md:flex md:justify-between">
                          <div className="flex gap-4">
                            <p className="text-neutral-400">First Name</p>
                            <p className="font-semibold">
                              {traveler?.firstName}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <p className="text-neutral-400">Last Name</p>
                            <p>{traveler?.lastName}</p>
                          </div>
                          <div className="flex gap-4">
                            <p className="text-neutral-400">Date of Birth</p>
                            <p>
                              {traveler?.dateOfBirth?.day}
                              <span className="text-neutral-400">/</span>
                              {traveler?.dateOfBirth?.month}
                              <span className="text-neutral-400">/</span>
                              {traveler?.dateOfBirth?.year}
                            </p>
                          </div>
                        </div>
                        <div className="md:flex md:justify-between gap-7 mt-5">
                          <div className="flex gap-4">
                            <p className="text-neutral-400">Passport Number</p>
                            <p>{traveler?.passportNo}</p>
                          </div>
                          <div className="flex gap-4">
                            <p className="text-neutral-400">
                              Passport Expiry Date
                            </p>
                            <p>
                              {traveler?.expiryDate?.day}
                              <span className="text-neutral-400">/</span>
                              {traveler?.expiryDate?.month}
                              <span className="text-neutral-400">/</span>
                              {traveler?.expiryDate?.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right md:mt-0 mt-4">
                      <p>{country?.toLocaleUpperCase() || ""}</p>
                      <p>
                        {visaOrderDate?.createdAt
                          ? new Date(
                              visaOrderDate.createdAt
                            ).toLocaleDateString("en-US", options)
                          : ""}
                      </p>
                      <div className="md:mt-[50px] mt-4">
                        <p>Grand Total</p>
                        <p>
                          {" "}
                          {priceConversion(
                            visaOrderDate?.totalPrice || 0,
                            selectedCurrency,
                            true
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ButtonSecondary
                      onClick={handleDownload}
                      className="md:mt-5 mt-4 w-full self-center flex justify-center"
                    >
                      Download Visa Invoice
                    </ButtonSecondary>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={` `}>
      <ErrorModal
        title="Something went wrong"
        text={error}
        isOpen={error?.length > 0}
        closeModal={closeModal}
      />
      {visaTravellerDetails?.length === 0 && (
        <div className="w-full container p-4 space-y-8 lg:pr-10 lg:space-y-10">
          <div className="listingSection__wrap">
            <div
              role="status"
              className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
            >
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
              </div>
            </div>

            <div
              role="status"
              className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
            >
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
              </div>
            </div>
          </div>

          <div className="listingSection__wrap">
            <div
              role="status"
              className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
            >
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
              </div>
            </div>

            <div
              role="status"
              className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
            >
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {visaTravellerDetails?.length > 0 && (
        <main className="container relative z-10 mt-11  flex-col lg:flex-row ">
          <nav
            className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 mr-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a
                    href="/visa"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    Visa
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a className="ml-1 text-sm font-medium text-gray-700 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                    Success Page
                  </a>
                </div>
              </li>
            </ol>
          </nav>

          <div className="w-full p-5 space-y-8 ">{renderSection2()}</div>
        </main>
      )}
    </div>
  );
};

export default visaSuccess;
