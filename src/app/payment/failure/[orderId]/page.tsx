"use client";

import StartRating from "@/components/StartRating";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BaseTypeEnum } from "@/data/attraction/types";
import { ArrowDownIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import priceConversion from "@/utils/priceConversion";
import Toggle from "@/shared/Toggle";
import { usePathname } from "next/navigation";
import SkeletonLoader from "@/app/profile/orders/SkeletonLoader";

export interface PayPageProps { }

interface OrderList {
  referenceNumber: string;
  createdAt: string;
  netPrice: number | null;
  paymentState: string
  orderStatus: string;
  attractionOrder: {
    activities: []
  }
  transferOrder: {
    journey: []
  }
}

const page: FC<PayPageProps> = () => {
  const renderContent = () => {
    const { countries, selectedCurrency } = useSelector(
      (state: RootState) => state.initials
    );
    const thisPathname = usePathname();
    const { jwtToken } = useSelector((state: RootState) => state.users);
    const { cart } = useSelector((state: RootState) => state.attraction);
    const [orderlist, setOrderList] = useState<OrderList>();
    // const [briefPayments, setBriefPayments] = useState(orderlist?.attractionOrder?.activities.map(() => true));
    const [orderId, setOrderId] = useState("");
    const [briefTransfer, setBriefTransfer] = useState(true);

    useEffect(() => {
      const currentURL = window.location.href;
      const url = new URL(currentURL);
      const pathArray = url.pathname.split("/");
      const orderIdIndex = pathArray.indexOf("payment") + 2;

      if (orderIdIndex < pathArray.length) {
        const orderId = pathArray[orderIdIndex];
        setOrderId(orderId);
      }
    }, []);



    const [finalPayment, setFinalPayment] = useState(true);

    // const toggleBriefPayment = (index: number) => {
    //   const updatedBriefPayments = [...briefPayments];
    //   updatedBriefPayments[index] = !updatedBriefPayments[index];
    //   setBriefPayments(updatedBriefPayments);
    // };


    const successOrders = async () => {
      try {
        const orderDetails = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/orders/single/${orderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        return orderDetails.json();
      } catch (error) {
        console.log(error);
      }
    };

    async function getSuccessOrders() {
      try {
        const response = await successOrders();
        setOrderList(response);
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      {
        orderId && (
          getSuccessOrders()
        )
      }
    }, [orderId])


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
                {orderlist?.transferOrder && (
          <h1 className={`text-xl font-semibold pb-2 border-b w-fit`}>
            Transfer
          </h1>
                )}

          {orderlist?.transferOrder?.journey?.map((item: any, index: number) => (
            <>
              {item?.trips?.map((trip: any, index: number) => (
                <div className="border rounded-lg mt-5 p-3">
                  <div
                    className={`flex items-center justify-between ${briefTransfer === false ? "" : "border-b"
                      } ${briefTransfer === false ? "" : "mb-3"}`}
                  >
                    <div className="md:flex items-center space-x-3 mb-3 md:mb-0">
                      <p className="text-xl p-3 font-semibold">
                        {trip?.transferFrom?.airportName}
                      </p>
                      <div className="hidden md:block">
                      <ArrowRightIcon height={24} width={24} />
                      </div>

                      <div className="md:hidden flex justify-center">
                      <ArrowDownIcon height={24} width={24} />
                      </div>
                      <p className="text-xl md:p-3 font-semibold">{trip?.transferTo?.areaName}</p>
                    </div>

                  </div>


                  <div className="">
                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <span>Date</span>
                      <span className="capitalize font-semibold">{format(new Date(trip?.pickupDate), "d MMM, yyyy")}</span>
                    </div>

                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300 mb-3 md:mb-0">
                      <span>Time</span>
                      <span className="capitalize font-semibold">{trip?.pickupTime}</span>
                    </div>

                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <p className="text-lg border-b font-semibold">Vehicle's</p>
                    </div>
                    {trip?.vehicleTypes?.map((vehicleType: any, vehicleIn: number) => (
                      <div className="border p-2 rounded-lg mt-3 md:flex md:gap-5 items-center">

                        <div>
                          {vehicleType && vehicleType?.vehicleId?.image && vehicleType?.vehicleId?.image && (
                            <Image
                              className="rounded-none cursor-pointer md:max-w-[200px] md:ml-2 md:absolute md:-mt-[90px]"
                              width={300}
                              height={100}
                              alt="picture 1"
                              src={`${process.env.NEXT_PUBLIC_CDN_URL}${vehicleType?.vehicleId?.image}`}
                            />
                          )}
                        </div>



                        <div className="md:pl-[200px] w-full text-lg">
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Name</span>
                            <span className="capitalize font-semibold">{vehicleType?.name}</span>
                          </div>
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Count</span>
                            <span className="capitalize font-semibold">{vehicleType?.count}</span>
                          </div>
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Airport Occupancy</span>
                            <span className="capitalize font-semibold">{vehicleType?.vehicleId?.airportOccupancy}</span>
                          </div>
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Normal Occupancy</span>
                            <span className="capitalize font-semibold">{vehicleType?.vehicleId?.normalOccupancy}</span>
                          </div>
                        </div>


                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ))}

        </div>
      );
    };

    const renderSidebar = () => {
      return (
        <div className="flex flex-col gap-5 w-full">
                {orderlist?.attractionOrder && (
          <h1 className="text-xl font-semibold pb-2 border-b w-fit">Tours</h1>
                )}
      
            {orderlist?.attractionOrder?.activities.map((item: any, i: number) => (
              <div key={item._id} className="rounded-lg border w-full md:p-3">
                <div className="md:flex md:gap-5 text-sm">
                  <div>
                    {item && item?.activity?.attraction?.images && item?.activity?.attraction?.images[0] && (
                      <Image
                        className="rounded-none w-full rounded-t-lg md:rounded-t-none md:mb-0 mb-3 cursor-pointer"
                        width={300}
                        height={100}
                        alt="picture 1"
                        src={`${process.env.NEXT_PUBLIC_CDN_URL}${item?.activity?.attraction?.images[0]}`}
                      />
                    )}
                  </div>

                  <div className="w-full text-lg p-3 md:p-0">
                    <div className="flex justify-between w-full text-neutral-6000 dark:text-neutral-300">
                      <p>Name</p>
                      <p className="capitalize font-semibold">
                        {item?.activity?.name}
                      </p>
                    </div>
                    <div className="flex justify-between w-full text-neutral-6000 dark:text-neutral-300">
                      <p>Transfer Type</p>
                      <p className="capitalize font-semibold">
                        {item?.transferType + " Transfer"}
                      </p>
                    </div>
                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <span>Date</span>
                      <span className="font-semibold">
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
                        <span className="font-semibold">{`${item.adultsCount} Adult`}</span>
                        {item.childrenCount > 0 ? (
                          <span className="font-semibold">{`${item.childrenCount} Child`}</span>
                        ) : (
                          ""
                        )}
                        {item.infantCount < 0 ? (
                          <span className="font-semibold">{`${item.infantCount} Infant`}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
         
        </div>
      );
    };

    
    return (
      <>
      {orderlist && (
      <div className="w-full flex flex-col sm:rounded-2xl space-y-10 px-0 sm:p-6 xl:p-8">
        {orderlist?.orderStatus === "completed" && (
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Congratulation 🎉
          </h2>
        )}

        {orderlist?.orderStatus !== "completed" && (
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Booking Failed 😔
          </h2>
        )}


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
              <span className="flex-1">Reference Number</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {orderlist?.referenceNumber}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Date</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {orderlist?.createdAt ? new Date(orderlist.createdAt).toDateString() : ''}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Total</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {orderlist?.netPrice ? priceConversion(orderlist?.netPrice, selectedCurrency, true) : 0}
              </span>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment method</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                CCAvenue
              </span>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment Status</span>
              <span className="flex-1 capitalize font-medium text-neutral-900 dark:text-neutral-100">
                {orderlist?.paymentState}
              </span>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Order Status</span>
              <span className="flex-1 capitalize font-medium text-neutral-900 dark:text-neutral-100">
                {orderlist?.orderStatus}
              </span>
            </div>
          </div>
        </div>
        <div>
          <ButtonPrimary href="/">Explore more attractions</ButtonPrimary>
        </div>
      </div>
      )}

      {!orderlist && (
        <>
        <div className="flex flex-col gap-10">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        </div>
        </>
      )}
      </>
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

export default page;
