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
import { RootState } from "@/redux/store";
import { setAdult, setChild } from "@/redux/features/visaSlice";
import VisaDocumentSubmitForm from "../VisaDocumentSubmitForm";
import InquirySidebar from "@/components/InquirySidebar/InquirySidebar";

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

const VisaDocumentSubmissionPage: FC<ListVisaDetailPage> = ({}) => {
  const thisPathname = usePathname();
  const router = useRouter();
  const [visaDetails, setVisaDetails] = useState<VisaDetails[] | null>(null);
  const [visaTC, setVisaTC] = useState<VisaTC | null>(null);
  const dispatch = useDispatch();
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const { documentSubmitted } = useSelector((state: RootState) => state.visa);

  const [visaNationality, setVisaNationality] = useState("");
  const [visaDestination, setVisaDestination] = useState("");
  const [visaId, setVisaId] = useState("");
  const [noOfAdults, setNoOfAdults] = useState(1);
  const [noOfChilds, setNoOfChilds] = useState(0);
  const [visaCompletion, setVisaCompletion] = useState(false);
  const [docSubmitted, setDocSubmitted] = useState(false);

  const [submittedVisa, setSubmittedVisa] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  const [passportFistPagePhoto, setPassportFistPagePhoto] = useState<File[]>(
    []
  );
  const [passportLastPagePhoto, setPassportLastPagePhoto] = useState<File[]>(
    []
  );
  const [passportSizePhoto, setPassportSizePhoto] = useState<File[]>([]);
  const [supportiveDoc1, setSupportiveDoc1] = useState<File[]>([]);
  const [supportiveDoc2, setSupportiveDoc2] = useState<File[]>([]);

  const [visaOrderId, setVisaOrderId] = useState("");
  const [visaOrderDetails, setVisaOrderDetails] = useState<VisaOrderDetails[]>(
    []
  );
  const initialSubmissionStatus = Array(visaOrderDetails?.length).fill(false);
  const [submissionStatus, setSubmissionStatus] = useState<boolean[]>(
    initialSubmissionStatus
  );

  useEffect(() => {
    const currentURL = window.location.href;

    const url = new URL(currentURL);
    const pathArray = url.pathname.split("/");
    const orderIdIndex = pathArray.indexOf("visa") + 2;

    if (orderIdIndex < pathArray.length) {
      const orderId = pathArray[orderIdIndex];

      setVisaOrderId(orderId);
    }
  }, []);

  const fetchVisaDetails = async (visaOrderId: string) => {
    try {
      const nationality = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/details/${visaOrderId}`
      );
      return nationality.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaDetails(visaOrderId: string) {
    try {
      const response = await fetchVisaDetails(visaOrderId);
      setVisaOrderDetails(response?.travellers);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      visaOrderId && getVisaDetails(visaOrderId);
    }
  }, [visaOrderId, documentSubmitted, docSubmitted]);

  const onChangePassportFistPagePhotoHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const temp_images: File[] = [...passportFistPagePhoto];
    temp_images[index] = e.target.files?.[0] as File;
    setPassportFistPagePhoto(temp_images);
  };

  const onChangePassportLastPagePhotoHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const temp2_images: File[] = [...passportLastPagePhoto];
    temp2_images[index] = e.target.files?.[0] as File;
    setPassportLastPagePhoto(temp2_images);
  };
  const onChangePassportSizePhotoHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let temp3_images = passportSizePhoto;
    temp3_images[index] = e.target.files?.[0] as File;
    setPassportSizePhoto(temp3_images);
  };
  const onChangeSupportiveDoc1Handler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let temp4_images = supportiveDoc1;
    temp4_images[index] = e.target.files?.[0] as File;
    setSupportiveDoc1(temp4_images);
  };
  const onChangeSupportiveDoc2Handler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let temp5_images = supportiveDoc2;
    temp5_images[index] = e.target.files?.[0] as File;
    setSupportiveDoc2(temp5_images);
  };

  const { adultTraveller, childTraveller, Adults, Childs } = useSelector(
    (state: RootState) => state.visa
  );

  const travellersArray = [...adultTraveller, ...childTraveller];

  useEffect(() => {
    dispatch(setAdult(noOfAdults));
  }, [noOfAdults]);

  useEffect(() => {
    dispatch(setChild(noOfChilds));
  }, [noOfChilds]);

  const visaDocumentSubmission = async (travellerId: string) => {
    const createUrl = `visa/application/document/${visaOrderId}/${travellerId}`;

    const formData = new FormData();
    for (let i = 0; i < passportFistPagePhoto.length; i++) {
      formData.append("passportFistPagePhoto", passportFistPagePhoto[i]);
    }
    for (let i = 0; i < passportLastPagePhoto.length; i++) {
      formData.append("passportLastPagePhoto", passportLastPagePhoto[i]);
    }
    for (let i = 0; i < passportSizePhoto.length; i++) {
      formData.append("passportSizePhoto", passportSizePhoto[i]);
    }
    for (let i = 0; i < supportiveDoc1.length; i++) {
      formData.append("supportiveDoc1", supportiveDoc1[i]);
    }
    for (let i = 0; i < supportiveDoc2.length; i++) {
      formData.append("supportiveDoc2", supportiveDoc2[i]);
    }


    let headers = {}
    if (jwtToken?.length && jwtToken !== null && jwtToken !== undefined) {
        headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
        }
    } else {
        headers = {
            "Content-Type": "multipart/form-data",
        }
    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/${createUrl}`,
        {
          method: "POST",
          body: formData,
          headers: headers
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function visaDocumentInitiating(travellerId: string, index: number) {
    try {
      const response = await visaDocumentSubmission(travellerId);
      setSubmissionStatus((prevStatus: boolean[]) => {
        const newStatus = [...prevStatus];
        newStatus[index] = true;
        return newStatus;
      });
    } catch (error) {
      console.error(error);
    }
  }

  let [categories] = useState(["Car for rent"]);

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Upload Details</h2>
        {visaOrderDetails.map((traveler, index) => (
          <div key={index} className="listingSection__wrap">
            <div className="md:flex md:justify-between">
              <div className="flex gap-4">
                <p className="text-neutral-400">First Name</p>
                <p className="font-semibold">{traveler?.firstName}</p>
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
            <div className="md:flex md:justify-between">
              <div className="flex gap-4">
                <p className="text-neutral-400">Passport Number</p>
                <p>{traveler?.passportNo}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Passport Expiry Date</p>
                <p>
                  {traveler?.expiryDate?.day}
                  <span className="text-neutral-400">/</span>
                  {traveler?.expiryDate?.month}
                  <span className="text-neutral-400">/</span>
                  {traveler?.expiryDate?.year}
                </p>
              </div>
            </div>

            <div className="listingSection__wrap">
              <div className="grid md:grid-cols-3  gap-9">
                <div className=" flex flex-col min-w-[200px]">
                  <label htmlFor="" className="label">
                    Passport First Page
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none"
                    name="passportFistPagePhoto"
                    type={"file"}
                    required
                    onChange={(e) =>
                      onChangePassportFistPagePhotoHandler(e, index)
                    }
                  />
                </div>
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Passport Second Page
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="passportLastPagePhoto"
                    type={"file"}
                    required
                    onChange={(e) =>
                      onChangePassportLastPagePhotoHandler(e, index)
                    }
                  />
                </div>
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Passport Size Photo
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="passportSizePhoto"
                    type={"file"}
                    required
                    onChange={(e) => onChangePassportSizePhotoHandler(e, index)}
                  />
                </div>
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Supportive Document 1
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="supportiveDoc1"
                    type={"file"}
                    required
                    onChange={(e) => onChangeSupportiveDoc1Handler(e, index)}
                  />
                </div>
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Supportive Document 2
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="supportiveDoc2"
                    type={"file"}
                    onChange={(e) => onChangeSupportiveDoc2Handler(e, index)}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="md:pt-8">
                <ButtonPrimary
                  disabled={submissionStatus[index]}
                  onClick={() => visaDocumentInitiating(traveler?._id, index)}
                  className="w-full"
                >
                  {submissionStatus[index] ? "Submitted" : "Submit Document"}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TravellerForms = Array.from({ length: noOfAdults }, (v, i) => i);
  const ChildForms = Array.from({ length: noOfChilds }, (v, i) => i);

  return (
    <div className={` `}>
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {visaOrderDetails?.length === 0 && (
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

        {visaOrderDetails?.length > 0 && (
          <div className="w-full lg:w-3/5 xl:w-2/3 p-4 space-y-8 lg:pr-10 lg:space-y-10">
            <nav
              className="flex px-5 py-3 text-gray-700 overflow-hidden border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
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

            {visaOrderDetails?.map((traveler, index) => (
              <VisaDocumentSubmitForm
                data={traveler}
                docSubmitted={docSubmitted}
                setDocSubmitted={setDocSubmitted}
                visaOrderId={visaOrderId}
              />
            ))}

            {visaOrderDetails.every(
              (traveler) => traveler?.isStatus === "submitted"
            ) && (
              <ButtonPrimary
                className="w-full"
                href={`/visa/success/${visaOrderId}` as Route}
              >
                Download Visa Invoice
              </ButtonPrimary>
            )}
          </div>
        )}

        {/* SIDEBAR */}
        <div className="block flex-grow mt-14 p-4 lg:mt-0">
          <div className="hidden lg:block mt-10 sticky top-28">
            <InquirySidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisaDocumentSubmissionPage;
