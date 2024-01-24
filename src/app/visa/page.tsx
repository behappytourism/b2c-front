"use client";

import React, { useEffect, useState } from "react";
import SectionHero from "@/app/(server-components)/SectionHero";
import InquirySidebar from "@/components/InquirySidebar/InquirySidebar";
import Link from "next/link";
import { Route } from "next";

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

interface Nation {
  slug: string;
  nationality: string;
}

const visaHome = () => {
  const [visaTC, setVisaTC] = useState<VisaTC | null>(null);
  const [nationality, setNationality] = useState<Nation[]>([]);

  const fetchVisaDetails = async () => {
    try {
      const nationality = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/type/uae-visa/all/india`
      );
      return nationality.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getVisaDetails() {
    try {
      const response = await fetchVisaDetails();
      setVisaTC(response?.visa);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getVisaDetails();
    getVisaNationality();
  }, []);

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
      // {
      //   response?.map((nationality: any, index: number) =>
      //     setValue(nationality?.nationality)
      //   );
      // }

      setNationality(response);

      // You can also do further processing with the response data here.
    } catch (error) {
      console.error(error);
    }
  }

  const nationalities = () => {
    return (
      <div className="p-5 shadow-2xl rounded-xl mt-44">
        <h2 className="text-2xl font-semibold">Apply Hassle Free E-visas</h2>
        <p className="text-sm mb-5">
          Hassle-Free travel with E-Visa: Your international gateway awaits!
        </p>
        <div className="grid grid-cols-4 max-h-[300px] overflow-x-auto">
          {nationality?.map((nations, index) => (
            <Link href={`/visa/uae-visa?nationality=${nations?.slug}` as Route}>
              <div className="p-1 border mb-3 rounded-xl mr-3 text-center cursor-pointer hover:bg-secondary-100">
                <p>
                  {nations?.nationality &&
                    nations.nationality.charAt(0).toUpperCase() +
                      nations.nationality.slice(1)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const termsAndConditions = visaTC?.termsAndConditions || "";

  const renderSectionTienIch = () => {
    return (
      <div className={`p-5 shadow-2xl rounded-xl ${!nationality?.length ? "mt-32" : "mt-4"}`}>
        <div>
          <p className="text-2xl font-semibold mb-5">
            Documents required for Dubai Visa{" "}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-y-6 gap-x-10 text-sm text-neutral-700 dark:text-neutral-300 ">
          {visaTC?.details?.map((item: any, index: number) => (
            <div key={index} className="items-center ">
              <p className="font-bold text-base">{item.title}</p>
              <p className="text-base">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="p-5 shadow-2xl rounded-xl mt-4">
        <h2 className="text-2xl font-semibold mb-5">Things to know</h2>
        {visaTC?.faqs?.map((ele: any, i: number) => (
          <div className="p-1 relative " key={ele?._id}>
            <input
              type="checkbox"
              className="peer absolute top-0 inset-x-0 w-full h-10 opacity-0  cursor-pointer"
            />
            <div className="flex items-center space-x-3">
              <span className="">+</span>
              <span className="text-lightblue">{ele?.question}</span>
            </div>
            <div
              className={`text-sm text-gray-400 font-light overflow-hidden  max-h-0 peer-checked:max-h-[100vh] transition-all duration-700 `}
            >
              <div className="p-1">
                <p className="">{ele?.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="p-5 shadow-2xl rounded-xl mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-y-6 gap-x-10 text-sm text-neutral-700 dark:text-neutral-300 ">
          <div className="flex items-center space-x-4 text-base">
            <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
          </div>
        </div>
      </div>
    );
  };

  const destinationDetails = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <p className="text-lg font-semibold">United Arab Emirates</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-y-6 gap-x-10 text-sm text-neutral-700 dark:text-neutral-300 ">
          <div className="items-center ">
            <p className="font-bold"></p>
            <p></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <header className="nc-PageHome relative">
        <div className="relative mb-2  lg:mb-2">
          <SectionHero
            currentPage="Visa"
            currentTab="Visa"
            className=" lg:block pt-10 lg:pt-16 lg:pb-16 bg-primary-6000"
          />
        </div>
      </header>
      <div className="container mt-5 p-4">
        {nationality.length > 0 && nationalities()}
      </div>
      <main className="nc-PageHome container relative mt-5 flex flex-col lg:flex-row ">
        <nav
          className="flex px-5 py-3  md:hidden text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
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
          </ol>
        </nav>
        <div className="mb-10 space-y-8 lg:pr-10 lg:space-y-10">
          {!visaTC && (
            <div>
              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
              >
                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>

              <div
                role="status"
                className="space-y-8 mt-9 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
              >
                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {visaTC?.details &&
            visaTC?.details?.length > 0 &&
            renderSectionTienIch()}

          {visaTC?.faqs && visaTC.faqs.length > 0 && renderSection8()}

          {visaTC?.termsAndConditions && renderSection2()}
        </div>

        {/* <div className="block flex-grow mt-14 p-4 lg:mt-0">
          <div className="hidden lg:block mt-10 sticky top-28">
            <InquirySidebar />
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default visaHome;
