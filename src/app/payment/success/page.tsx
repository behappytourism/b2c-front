"use client";

import StartRating from "@/components/StartRating";
import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BaseTypeEnum } from "@/data/attraction/types";
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import priceConversion from "@/utils/priceConversion";
import Toggle from "@/shared/Toggle";

export interface PayPageProps {}

const PayPage: FC<PayPageProps> = () => {
  const renderContent = () => {
    const { countries, selectedCurrency } = useSelector(
      (state: RootState) => state.initials
    );
    const { jwtToken } = useSelector((state: RootState) => state.users);
    const { cart } = useSelector((state: RootState) => state.attraction);
  
    const [briefPayments, setBriefPayments] = useState(cart.map(() => true));
    const [briefTransfer, setBriefTransfer] = useState(true);
  
  
    const [finalPayment, setFinalPayment] = useState(true);
  
    const toggleBriefPayment = (index: number) => {
      const updatedBriefPayments = [...briefPayments];
      updatedBriefPayments[index] = !updatedBriefPayments[index];
      setBriefPayments(updatedBriefPayments);
    };


    const activity = cart.map((item) => {
      return {
        activity: item?._id,
        date: item?.date,
        adultsCount: item?.adultCount,
        childrenCount: item?.childCount,
        infantCount: item?.infantCount,
        hoursCount:
          item?.base === BaseTypeEnum.hourly ? item?.hourCount : undefined,
        transferType: item?.transferType,
        slot: item?.slot,
        isPromoAdded: item?.isPromoAdded,
      };
    });



    const renderTransfer = () => {
      return (
        <div>
          <h1 className={`text-xl font-semibold pb-2 border-b w-fit`}>
            Transfer
          </h1>
          <div className="border rounded-lg mt-5 p-3">
            <div
              className={`flex items-center justify-between ${
                briefTransfer === false ? "" : "border-b"
              } ${briefTransfer === false ? "" : "mb-3"}`}
            >
              <div className="flex items-center space-x-3">
                <p className="text-xl p-3 font-semibold">
                  Dubai International Airport
                </p>
                <ArrowRightIcon height={24} width={24} />
                <p className="text-xl p-3 font-semibold">Business Bay</p>
              </div>

              <div>
                <div className="flex gap-3">
                  {briefTransfer === false && (
                    <p className="cursor-pointer">
                      <ChevronDownIcon
                        onClick={() => setBriefTransfer(!briefTransfer)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                  {briefTransfer === true && (
                    <p className="cursor-pointer">
                      <ChevronUpIcon
                        onClick={() => setBriefTransfer(!briefTransfer)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>

            {briefTransfer === true && (
              <div className="">
                <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                  <span>Date</span>
                  <span className="capitalize">2024-02-04</span>
                </div>

                <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                  <span>Time</span>
                  <span className="capitalize">08:50</span>
                </div>

                <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                  <p className="text-lg border-b font-semibold">Vehicle's</p>
                </div>
                <div className="border p-2 rounded-lg mt-3">
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Seater</span>
                    <span className="capitalize">14 Seater</span>
                  </div>
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Count</span>
                    <span className="capitalize">3</span>
                  </div>
                </div>

                <div className="border p-2 rounded-lg mt-3">
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Seater</span>
                    <span className="capitalize">12 Seater</span>
                  </div>
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Count</span>
                    <span className="capitalize">1</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderSidebar = () => {
      return (
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-xl font-semibold pb-2 border-b w-fit">Tours</h1>
          {cart.length ? (
            cart.map((item, i) => (
              <div key={item._id} className="rounded-lg border w-full p-3">
                <div className="flex flex-col gap-2 text-sm">
                  <div
                    className={`flex justify-between items-center gap-2 ${
                      briefPayments[i] === false ? "" : "border-b"
                    }`}
                  >
                    <p className="text-xl p-3 font-semibold">{item.name}</p>
                    <div className="flex gap-3">
                      {briefPayments[i] === false && (
                        <p className="cursor-pointer">
                          <ChevronDownIcon
                            onClick={() => toggleBriefPayment(i)}
                            height={20}
                            width={20}
                          />
                        </p>
                      )}
                      {briefPayments[i] === true && (
                        <p className="cursor-pointer">
                          <ChevronUpIcon
                            onClick={() => toggleBriefPayment(i)}
                            height={20}
                            width={20}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                  {briefPayments[i] === true && (
                    <div className="">
                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span>Transfer Type</span>
                        <span className="capitalize">
                          {item.transferType + " Transfer"}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span>Date</span>
                        <span>
                          {format(new Date(item.date), "d MMM, yyyy")}
                        </span>
                      </div>
                      {item.hasOwnProperty("slot") && item.slot ? (
                        <>
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Slot</span>
                            <span>{item.slot.EventName}</span>
                          </div>{" "}
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Slot Date</span>
                            <span>
                              {format(
                                new Date(item.slot?.StartDateTime),
                                "d-M-yyyy"
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      {item.base === BaseTypeEnum.hourly ? (
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>Hours</span>
                          <span>{item.hourCount + " Hour"}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>Pax</span>
                          <span>{`${item.adultCount} Adult`}</span>
                          {item.childCount > 0 ? (
                            <span>{`${item.childCount} Child`}</span>
                          ) : (
                            ""
                          )}
                          {item.infantCount < 0 ? (
                            <span>{`${item.infantCount} Infant`}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      )} 
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>
              <div className="listingSectionSidebar__wrap shadow max-w-sm">
                <div className="flex flex-wrap gap-2 items-center justify-center text-neutral-600 dark:text-neutral-400">
                  <i className="las la-cart-plus text-3xl "></i>
                  <p className="">Your cart is empty.</p>
                </div>
                <ButtonPrimary href="/">Continue Shopping</ButtonPrimary>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col sm:rounded-2xl space-y-10 px-0 sm:p-6 xl:p-8">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          Congratulation 🎉
        </h2>

        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* ------------------------ */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Your booking</h3>
          <div className="sm:items-center">
            {renderSidebar()}
          </div>
          <div className="sm:items-center">
            {renderTransfer()}
          </div>
        </div>

        {/* ------------------------ */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Booking detail</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Booking code</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                #222-333-111
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Date</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                06 Feb, 2024
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Total</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                $199
              </span>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment method</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                Credit card
              </span>
            </div>
          </div>
        </div>
        <div>
          <ButtonPrimary href="/">Explore more attractions</ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-PayPage`}>
      <main className="container mt-11 mb-24 lg:mb-32 ">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default PayPage;
