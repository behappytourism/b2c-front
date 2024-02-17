"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonSubmit from "./ButtonSubmit";
import { useTimeoutFn } from "react-use";
import StaySearchForm from "./(stay-search-form)/StaySearchForm";
import CarsSearchForm from "./(car-search-form)/CarsSearchForm";
import FlightSearchForm from "./(flight-search-form)/FlightSearchForm";
import ExperiencesSearchForm from "../(HeroSearchForm)/(experiences-search-form)/ExperiencesSearchForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SectionHero from "@/app/(server-components)/SectionHero";
import Link from "next/link";
import VisaDestination from "../(HeroSearchForm)/(car-search-form)/VisaDestination";
import VisaNationality from "../(HeroSearchForm)/(car-search-form)/VisaNationality";
import { setInitialData } from "@/redux/features/initialsSlice";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "next";
import TransferSearchForm from "@/app/transfer/TransferSearchForm";

const HeroSearchForm2Mobile = () => {
  const dispatch = useDispatch();
  const route = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("attractions");
  const { navigated, visaNavigated } = useSelector(
    (state: RootState) => state.affiliateUsers
  );
  const [visaDestination, setVisaDestination] = useState("");
  const [visaNationality, setVisaNationality] = useState("");
  const [isNationality, setIsNationality] = useState("");
  const { Nationality } = useSelector((state: RootState) => state.visa);

  useEffect(() => {
    closeModal();
  }, [navigated]);



  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false);
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1);
  //
  function closeModal() {
    setShowModal(false);
    setCurrentTab("attractions");
  }

  function openModal() {
    setShowModal(true);
  }

  const handleDispatchNationality = (item: string) => {
    dispatch(setInitialData({ Nationality: item }));
  };

  const handleVisaSearch = (Nationality: string) => {
 route.push(`/visa/uae-visa?nationality=${Nationality}` as Route)
 closeModal()
  }

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg"
      >
        <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />

        <div className="ml-3 flex-1 text-left overflow-hidden">
          <span className="block font-medium text-sm">Where to?</span>
          <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400 ">
            <span className="line-clamp-1">
              Anywhere • Any week • Add guests
            </span>
          </span>
        </div>

        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block w-4 h-4"
            fill="currentColor"
          >
            <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
          </svg>
        </span>
      </button>
    );
  };

  return (
    <div className="HeroSearchForm2Mobile">
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-max"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden w-full">
                  {showDialog && (
                    <Tab.Group manual>
                      <div className="absolute left-4 top-4">
                        <button className="" onClick={closeModal}>
                          <XMarkIcon className="w-5 h-5 text-black dark:text-white" />
                        </button>
                      </div>

                      <Tab.List className="pt-12 flex w-full justify-center font-semibold text-sm sm:text-base text-neutral-500 dark:text-neutral-400 space-x-6 sm:space-x-8">
                        {["Attractions", "Transfer"].map((item, index) => (
                          <Tab

                            key={index}
                            as={Fragment}
                          >
                            {({ selected }) => (
                              <div onClick={() => setCurrentTab(item.toLowerCase())} className="relative focus:outline-none focus-visible:ring-0 outline-none select-none">
                                <div
                                  className={`${selected ? "text-black dark:text-white" : ""
                                    }  `}
                                >
                                  {item}
                                </div>
                                {selected && (
                                  <span className="absolute inset-x-0 top-full border-b-2 border-black dark:border-white"></span>
                                )}
                              </div>
                            )}
                          </Tab>
                        ))}
                      </Tab.List>
                      {currentTab === "attractions" && (
                        <ExperiencesSearchForm closeModal={closeModal} />
                      )}

                      {currentTab === "transfer" && (
                        <>
                         <TransferSearchForm closeModal={closeModal} />
                        </>
                      )}
                    </Tab.Group>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default HeroSearchForm2Mobile;
