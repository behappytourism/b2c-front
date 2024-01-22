"use client";

import React, { FC, Fragment, useEffect, useState } from "react";

import ButtonPrimary from "@/shared/ButtonPrimary";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";
import { Tab } from "@headlessui/react";
import CarCard from "@/components/CarCard";
import TravellersVisaForm from "./TravellersVisaForm";
import ChildrenVisaForm from "./ChildrenVisaForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAdult, setChild } from "@/redux/features/visaSlice";
import priceConversion from "@/utils/priceConversion";
import ErrorModal from "@/shared/Status/ErrorModal";
import SigninModal from "@/components/SigninModal/SigninModal";
import ButtonSecondary from "@/shared/ButtonSecondary";
import InquirySidebar from "@/components/InquirySidebar/InquirySidebar";
export interface ListVisaDetailPage { }

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

interface submittedVisa {
  _id: string;
}

interface VisaOrderDetails {
  _id: string;
  email: string;
  isStatus: string;
  firstName: string;
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

const VisaBookingPage: FC<ListVisaDetailPage> = ({ }) => {
  const url = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );
  const [visaDetails, setVisaDetails] = useState<VisaDetails[] | null>(null);
  const [visaTC, setVisaTC] = useState<VisaTC | null>(null);
  const dispatch = useDispatch();
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const { countries } = useSelector((state: RootState) => state.initials);
  const [error, setError] = useState<string>("");

  const [visaNationality, setVisaNationality] = useState("");
  const [visaDestination, setVisaDestination] = useState("");
  const [visaId, setVisaId] = useState("");
  const [noOfAdults, setNoOfAdults] = useState(1);
  const [noOfChilds, setNoOfChilds] = useState(0);
  const [visaCompletion, setVisaCompletion] = useState(false);
  const [itenaryCompletion, setItenaryCompletion] = useState(false);
  const [submittedVisa, setSubmittedVisa] = useState<submittedVisa | null>(
    null
  );
  const [paymentUrl, setPaymentUrl] = useState("");
  const filteredVisas = visaDetails?.filter((visa) => visa._id === visaId);
  const filteredCountries = countries.filter(
    (country) => country?.countryName?.toLowerCase() === visaNationality
  );

  const [visaOrderDetails, setVisaOrderDetails] = useState<VisaOrderDetails[]>(
    []
  );

  const fetchVisaTravelerDetails = async (visaOrderId: string) => {
    try {
      const nationality = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/details/${visaOrderId}`
      );
      return nationality.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaTravelerDetails(visaOrderId: string) {
    try {
      const response = await fetchVisaTravelerDetails(submittedVisa?._id || "");
      setVisaOrderDetails(response?.travellers);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      submittedVisa?._id && getVisaTravelerDetails(submittedVisa?._id);
    }
  }, [submittedVisa]);

  useEffect(() => {
    const visaNationality = searchParams.get("nationality");
    const visaId = searchParams.get("visaType");
    const pathnameParts = url?.split("/");
    const visaDestination = pathnameParts[2];

    if (visaNationality !== "") {
      setVisaNationality(visaNationality || "");
    }

    if (visaId !== "") {
      setVisaId(visaId || "");
    }

    if (visaDestination !== "") {
      setVisaDestination(visaDestination || "");
    }
  }, []);

  const { adultTraveller, childTraveller, Adults, Childs } = useSelector(
    (state: RootState) => state.visa
  );

  const travellersArray = [...adultTraveller, ...childTraveller];

  const visaDetailSubmission = async () => {
    const body = {
      noOfAdult: noOfAdults,
      noOfChild: noOfChilds,
      visaType: visaId,
      travellers: travellersArray,
      nationality: visaNationality,
    };

    let headers = {}
    if (jwtToken?.length && user?.name && jwtToken !== null && jwtToken !== undefined) {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }
    } else {
      headers = {
        "Content-Type": "application/json",
      }
    }
    try {
      const visaDetails = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/create`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
      return visaDetails.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function postVisaDetail() {
    try {
      const response = await visaDetailSubmission();
      setSubmittedVisa(response);
      {
        !response?.error && setVisaCompletion(true);
      }
      setError(response?.error);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    dispatch(setAdult(noOfAdults));
  }, [noOfAdults]);

  useEffect(() => {
    dispatch(setChild(noOfChilds));
  }, [noOfChilds]);

  const fetchVisaDetails = async () => {
    try {
      const nationality = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/type/${visaDestination}/all/${visaNationality}`
      );
      return nationality.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaDetails() {
    try {
      const response = await fetchVisaDetails();
      setVisaDetails(response?.visaTypes);
      setVisaTC(response?.visa);
    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = () => {
    setError("");
  };

  useEffect(() => {
    {
      visaDestination && visaNationality && getVisaDetails();
    }
  }, [visaDestination, visaNationality]);

  const visaPayment = async () => {
    const createUrl = `visa/application/initiate/${submittedVisa?._id}?visa=${visaDestination}&visaType=${visaId}&nationality=${visaNationality}`;

    const payload = {
      submittedVisa,
      paymentProcessor: "ccavenue",
    };


    let headers = {}
    if (jwtToken?.length && jwtToken !== null && jwtToken !== undefined) {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }
    } else {
      headers = {
        "Content-Type": "application/json",
      }
    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/${createUrl}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: headers
        }
      );

      return response.text();
    } catch (error) {
      console.log(error);
    }
  };

  async function visaPaymentSubmission() {
    try {
      const response = await visaPayment();

      if (typeof response === "string") {
        const winUrl = URL.createObjectURL(
          new Blob([response], { type: "text/html" })
        );

        if (typeof window !== undefined) {
          window.location.replace(winUrl);
        }
      } else {
        console.error("Response is not a string");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const termsAndConditions = visaTC?.termsAndConditions || "";

  let [categories] = useState(["Car for rent"]);

  const renderSection3 = () => {
    return (
      <div className="p-5 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-2xl font-semibold mb-5">Itenary</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {filteredVisas?.map((item: any) => (
            <div key={item._id}>
              <div className="flex items-center space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span>{item.visaName}</span>
              </div>

              <div className="flex items-center space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span>
                  Validity {item?.validity} {item?.validityTimeFormat}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full gap-4 mt-5">
          <div className="col-span-2 flex flex-col w-full">
            <label htmlFor="" className="label">
              Adult
            </label>
            <select
              name="noOfAdult"
              value={noOfAdults}
              required
              onChange={(e) =>
                setNoOfAdults(e.target.value as unknown as number)
              }
              placeholder="Select"
              className="w-full py-2 px-3 dark:bg-gray-800 dark:border-gray-700 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
            >
              <option selected hidden disabled>
                Select
              </option>
              {Array.from({ length: 9 }).map((ele, i) => (
                <option value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex flex-col w-full">
            <label htmlFor="" className="label">
              Child
            </label>
            <select
              name="noOfChild"
              value={noOfChilds}
              required
              onChange={(e) =>
                setNoOfChilds(e.target.value as unknown as number)
              }
              placeholder="Select"
              className="w-full py-2 px-3 rounded-md dark:bg-gray-800 dark:border-gray-700 p-1 text-primaryColor border border-lightblue outline-none"
            >
              <option selected hidden disabled>
                Select
              </option>
              {Array.from({ length: 9 }).map((ele, i) => (
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        <ButtonPrimary className="w-full mt-5" onClick={() => setItenaryCompletion(!itenaryCompletion)}>
          Continue
        </ButtonPrimary>
      </div>
    );
  };

  const itenaryComplete = () => {
    return (
      <div className="shadow-2xl rounded-xl p-5">
        <div>
          <h2 className="text-2xl font-semibold mb-5">Itenary</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {filteredVisas?.map((item: any) => (
            <div key={item._id}>
              <div className="flex items-center space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span>{item.visaName}</span>
              </div>

              <div className="flex items-center space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span>
                  Validity {item?.validity} {item?.validityTimeFormat}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full gap-4 mt-5">
          <div className="col-span-2 flex flex-col w-full">
            <label htmlFor="" className="label">
              Adult
            </label>
            <select
              name="noOfAdult"
              value={noOfAdults}
              required
              disabled
              onChange={(e) =>
                setNoOfAdults(e.target.value as unknown as number)
              }
              placeholder="Select"
              className="w-full py-2 px-3 dark:bg-gray-800 dark:border-gray-700 rounded-md p-1 text-primaryColor border border-lightblue outline-none"
            >
              <option selected hidden disabled>
                Select
              </option>
              {Array.from({ length: 9 }).map((ele, i) => (
                <option value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex flex-col w-full">
            <label htmlFor="" className="label">
              Child
            </label>
            <select
              name="noOfChild"
              value={noOfChilds}
              required
              disabled
              onChange={(e) =>
                setNoOfChilds(e.target.value as unknown as number)
              }
              placeholder="Select"
              className="w-full py-2 px-3 rounded-md dark:bg-gray-800 dark:border-gray-700 p-1 text-primaryColor border border-lightblue outline-none"
            >
              <option selected hidden disabled>
                Select
              </option>
              {Array.from({ length: 9 }).map((ele, i) => (
                <option value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        <ButtonPrimary className="w-full mt-5" onClick={() => setItenaryCompletion(!itenaryCompletion)}>
          Edit
        </ButtonPrimary>
      </div>
    );
  };

  const renderSidebarPrice = () => {
    return (
      <div className="rounded-xl shadow-2xl p-5">
        <div className="flex justify-between">
          <span className="text-2xl font-semibold mb-5">Price Details</span>
        </div>

        {filteredVisas?.map((item: any) => (
          <div className="flex flex-col space-y-4 ">
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span>Adult</span>
              <span>
                {priceConversion(
                  item?.adultPrice * noOfAdults,
                  selectedCurrency,
                  true
                )}
              </span>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span>Children</span>
              <span>
                {priceConversion(
                  item?.childPrice * noOfChilds,
                  selectedCurrency,
                  true
                )}
              </span>
            </div>

            <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {priceConversion(
                  item?.adultPrice * noOfAdults + item?.childPrice * noOfChilds,
                  selectedCurrency,
                  true
                )}{" "}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TravellerForms = Array.from({ length: noOfAdults }, (v, i) => i);
  const ChildForms = Array.from({ length: noOfChilds }, (v, i) => i);

  const visaForm = () => {
    return (
      <div className="rounded-xl shadow-2xl p-5">
        <div>
          <h2 className="text-2xl font-semibold">Traveller Details</h2>

          {TravellerForms.map((index) => (
            <TravellersVisaForm
              key={index}
              index={index}
              visaNationality={visaNationality}
              visaCountryId={filteredCountries[0]?._id || ""}
            />
          ))}

          {noOfChilds > 0 && (
            <>
              {ChildForms.map((index) => (
                <ChildrenVisaForm
                  key={index}
                  index={index}
                  visaNationality={visaNationality}
                  visaCountryId={filteredCountries[0]?._id || ""}
                />
              ))}
            </>
          )}
        </div>

        <ButtonPrimary className="w-full mt-5" onClick={postVisaDetail}>
          {travellersArray.some(
            (traveller) =>
              !traveller.firstName &&
              !traveller.lastName &&
              !traveller.passportNo &&
              !traveller.contactNo &&
              !traveller.title
          )
            ? "Please fill all the fields"
            : "Submit Application"}
        </ButtonPrimary>
      </div>
    );
  };

  const visaFormCompletion = () => {
    return (
      <div className="shadow-2xl rounded-xl p-5">
        <div className="flex gap-2 text-center items-center mb-3">
          <h2 className="md:text-2xl text-xl font-semibold">
            Traveller Details Submitted
          </h2>
          <i className="las la-check-circle text-3xl"></i>
        </div>
        {visaOrderDetails.map((traveler, index) => (
          <>
            <div key={index} className="border rounded-xl p-3 mb-3">
              <div className="md:flex md:justify-between md:mb-3 mb-1">
                <div className="md:flex md:gap-4 mb-1 md:mb-0">
                  <p className="text-neutral-400 text-sm md:text-base">
                    First Name
                  </p>
                  <p className="font-semibold">{traveler?.firstName}</p>
                </div>
                <div className="md:flex md:gap-4">
                  <p className="text-neutral-400 text-sm md:text-base">
                    Last Name
                  </p>
                  <p className="font-semibold">{traveler?.lastName}</p>
                </div>
              </div>

              <div className="md:flex md:justify-between md:mb-3 mb-1">
                <div className="md:flex md:gap-4 mb-1 md:mb-0">
                  <p className="text-neutral-400 text-sm md:text-base">
                    Date of Birth
                  </p>
                  <p className="font-semibold">
                    {traveler?.dateOfBirth?.day}
                    <span className="text-neutral-400">/</span>
                    {traveler?.dateOfBirth?.month}
                    <span className="text-neutral-400">/</span>
                    {traveler?.dateOfBirth?.year}
                  </p>
                </div>
                <div className="md:flex md:gap-4">
                  <p className="text-neutral-400 text-sm md:text-base">Email</p>
                  <p className="font-semibold">{traveler?.email}</p>
                </div>
              </div>

              <div className="md:flex md:justify-between">
                <div className="md:flex md:gap-4 mb-1 md:mb-0">
                  <p className="text-neutral-400 text-sm md:text-base">
                    Passport Number
                  </p>
                  <p className="font-semibold">{traveler?.passportNo}</p>
                </div>
                <div className="md:flex md:gap-4">
                  <p className="text-neutral-400 text-sm md:text-base">
                    Passport Expiry Date
                  </p>
                  <p className="font-semibold">
                    {traveler?.expiryDate?.day}
                    <span className="text-neutral-400">/</span>
                    {traveler?.expiryDate?.month}
                    <span className="text-neutral-400">/</span>
                    {traveler?.expiryDate?.year}
                  </p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    );
  };

  const visaFormPending = () => {
    return (
      <div className="listingSection__wrap">
        <div className="flex gap-2 text-center items-center">
          <h2 className="text-3xl font-semibold">Add Travelers Details</h2>
        </div>
      </div>
    );
  };

  const MakePaymentCompletion = () => {
    return (
      <div className="rounded-xl shadow-2xl p-5">
        <div className="flex gap-2 text-center items-center">
          <h2 className="text-3xl font-semibold">Make Payment</h2>
        </div>
      </div>
    );
  };

  const MakePayment = () => {
    return (
      <div className="rounded-xl shadow-2xl p-5">
        <div className="">
          {/* <div className="p-4 bg-primary-6000 w-fit rounded-2xl font-bold text-white">
            <p className="text-xl mb-4">Payments</p>
            <p className="bg-blue-800 rounded-lg p-2">CC Avenue</p>
          </div> */}
          <div>
            <h2 className="text-2xl  font-semibold">Make Payment</h2>
            <p>By clicking on "Pay Now" button, you will be redirect to CC Avenue payment page to complete your order succesfully.</p>

            <ButtonPrimary
              className="w-full mt-4"
              onClick={visaPaymentSubmission}
            >
              Pay Now
            </ButtonPrimary>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={` `}>
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {!filteredVisas && (
          <div className="w-full lg:w-3/5 xl:w-2/3 p-4 space-y-8 lg:pr-10 lg:space-y-10">
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
        {filteredVisas && (
          <div className="w-full lg:w-3/5 xl:w-2/3 p-4 space-y-8 lg:pr-10 lg:space-y-10">
            <nav
              className="flex px-5 py-3 overflow-hidden text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
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
                    <a
                      href={`/visa/uae-visa?nationality=${visaNationality}`}
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      Available Visas
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
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                      Visa Booking
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {itenaryCompletion === false && (
              <>
                {renderSection3()}
                {visaFormPending()}
              </>
            )}

            {itenaryCompletion === true && <>{itenaryComplete()}</>}
            {visaCompletion === false && itenaryCompletion === true && (
              <>{visaForm()} </>
            )}

            {visaCompletion === true && <>{visaFormCompletion()}</>}

            {visaCompletion === true && <>{MakePayment()}</>}
            <ErrorModal
              title="Something went wrong"
              text={error}
              isOpen={error?.length > 0}
              closeModal={closeModal}
            />
          </div>
        )}

        {/* SIDEBAR */}
        <div className="block flex-grow mt-14 p-4 lg:mt-0">
          <div className="hidden lg:block mt-10 sticky top-28">
            {filteredVisas && (
              <>
                {renderSidebarPrice()}
                <div className="mt-11">
                  <InquirySidebar />
                </div>
              </>
            )}

            {!filteredVisas && (
              <>
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

                <div className="listingSection__wrap mt-3">
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisaBookingPage;
