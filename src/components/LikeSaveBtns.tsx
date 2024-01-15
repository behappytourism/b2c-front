"use client";

import { ExcursionDetails } from "@/data/attraction/types";
import ButtonClose from "@/shared/ButtonClose";
import { Dialog, Transition } from "@headlessui/react";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";

const LikeSaveBtns = ({
  attraction,
  handleFavourites,
  isLiked = false,
}: {
  attraction?: ExcursionDetails;
  handleFavourites?: (data: ExcursionDetails) => void;
  isLiked?: boolean;
}) => {
  const pathname = usePathname();

  const [modalHandler, setModalHandler] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Handle close modal.
  const closeModal = () => {
    setModalHandler(false);
  };

  // time out for copy functionality.
  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }, [isCopied]);

  const renderMotalAmenities = () => {
    if (attraction === undefined || null) {
      return null;
    }

    return (
      <Transition appear show={modalHandler} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-auto w-full max-w-sm">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="headlessui-dialog-title-70"
                    >
                      Share
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModal} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    <div className="flex flex-col gap-3 py-4 rounded-2xl ">
                      <div>
                        <h2 className="flex text-center font-semibold justify-center pt-2">
                          {attraction.title}
                        </h2>
                      </div>
                      {attraction?.images?.length ? (
                        <div className=" flex items-center space-x-1 font-semibold text-lg">
                          <img
                            src={
                              process.env.NEXT_PUBLIC_CDN_URL +
                              attraction?.images[0]
                            }
                            alt="banner"
                            className='object"-cover h-32 w-full rounded-2xl '
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="flex justify-between  items-center space-x-2">
                        <div className="w-full text-xs py-2 rounded-lg bg-stone-200 px-2 whitespace-nowrap overflow-hidden">
                          {process.env.NEXT_PUBLIC_CLIENT_URL + pathname}{" "}
                        </div>
                        <div
                          className="text-2xl"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              process.env.NEXT_PUBLIC_CLIENT_URL + pathname
                            );
                            setIsCopied(true);
                          }}
                        >
                          {!isCopied ? (
                            <i className="las la-clipboard text-2xl"></i>
                          ) : (
                            <i className="las la-clipboard-check text-2xl"></i>
                          )}
                        </div>
                      </div>
                      <div className="p-5 mx-5 flex items-center justify-center font-medium">
                        <div className="mr-3">Share To:</div>
                        <div className="flex items-center space-x-3">
                          <a
                            href={`whatsapp://send?text=${process.env.NEXT_PUBLIC_CLIENT_URL + pathname
                              }`}
                            target="_blank"
                          >
                            <span className="h-10 w-10 rounded-full bg-green-600 text-light text-xl flex justify-center items-center">
                              <i className="lab la-whatsapp text-xl text-white"></i>
                            </span>
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_CLIENT_URL + pathname
                              }`}
                            target="_blank"
                          >
                            <span className="h-10 w-10 rounded-full bg-blue-600 text-light text-xl flex justify-center items-center">
                              <i className="lab la-facebook-f text-xl text-white"></i>
                            </span>
                          </a>
                          <a
                            href={`'http://twitter.com/share?url=${process.env.NEXT_PUBLIC_CLIENT_URL + pathname
                              }`}
                            target="_blank"
                          >
                            <span className="h-10 w-10 rounded-full bg-sky-600  text-light text-xl flex justify-center items-center">
                              <i className="lab la-twitter text-xl text-white"></i>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <div className="flow-root">
      {renderMotalAmenities()}
      <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
        <span
          onClick={() => setModalHandler(true)}
          className="py-1.5 px-3 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="hidden sm:block ml-2.5">Share</span>
        </span>
        <span
          onClick={() => {
            if (handleFavourites && attraction) {
              handleFavourites(attraction);
              console.log("work");
            }
          }}
          className="py-1.5 px-3 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          {!isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#db0000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                  fill="#db0000"
                ></path>{" "}
              </g>
            </svg>
          )}
          <span className="hidden sm:block ml-2.5">Save</span>
        </span>
      </div>
    </div>
  );
};

export default LikeSaveBtns;
