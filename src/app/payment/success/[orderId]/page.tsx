"use client";

import StartRating from "@/components/StartRating";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BaseTypeEnum } from "@/data/attraction/types";
import {
  ArrowDownIcon,
  ArrowDownOnSquareIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import priceConversion from "@/utils/priceConversion";
import Toggle from "@/shared/Toggle";
import { usePathname } from "next/navigation";
import DefaultLoader from "@/components/loader/DefaultLoader";
import ButtonSecondary from "@/shared/ButtonSecondary";

export interface PayPageProps {}

interface OrderList {
  attractionId: string;
  referenceNumber: string;
  createdAt: string;
  netPrice: number | null;
  paymentState: string;
  orderStatus: string;
  attractionOrder: {
    activities: [];
  };
  transferOrder: {
    journey: [];
  };
}

const PayPage: FC<PayPageProps> = () => {
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
    const [attractionOrderSingleTicket, setAttractionOrderSingleTicket] =
      useState<null | Blob>(null);
    const [search, setSearch] = useState(false);
    const [invoice, setInvoice] = useState(false);

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
    const [orderInvoice, setOrderInvoice] = useState<null | Blob>(null);
    const [attractionOrderAllTickets, setAttractionOrderAllTickets] =
      useState<null | Blob>(null);

    const fetchAttractionInvoice = async (orderId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/orders/invoice/${orderId}`,
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

    async function getOrderInvoice(orderId: string) {
      setInvoice(true);
      try {
        const response = await fetchAttractionInvoice(orderId);

        if (response) {
          setOrderInvoice(response);
        } else {
          // Handle the case when response is undefined
          // For example, set an appropriate error message or handle it accordingly
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      if (orderInvoice) {
        const pdfBlob = new Blob([orderInvoice], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orderInvoice.pdf";
        a.click();
      }
      setInvoice(false);
    }, [orderInvoice]);

    const fetchAttractionSingleTicket = async (
      attractionOrderId: string,
      activityId: string,
      ticketId: string
    ) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/${attractionOrderId}/ticket/${activityId}/single/${ticketId}`,
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

    async function getAttractionSingleTicket(
      attractionOrderId: string,
      activityId: string,
      ticketId: string
    ) {
      try {
        const response = await fetchAttractionSingleTicket(
          attractionOrderId,
          activityId,
          ticketId
        );

        if (response) {
          setAttractionOrderSingleTicket(response);
        } else {
          // Handle the case when response is undefined
          // For example, set an appropriate error message or handle it accordingly
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      if (attractionOrderSingleTicket) {
        const pdfBlob = new Blob([attractionOrderSingleTicket], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attractionticket.pdf";
        a.click();
      }
    }, [attractionOrderSingleTicket]);

    const fetchAttractionAllTickets = async (
      attractionId: string,
      activityId: string
    ) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/${attractionId}/ticket/${activityId}`,
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

    async function getAttractionAllTickets(
      attractionId: string,
      activityId: string
    ) {
      setSearch(true);
      try {
        const response = await fetchAttractionAllTickets(
          attractionId,
          activityId
        );

        if (response) {
          setAttractionOrderAllTickets(response);
        } else {
          // Handle the case when response is undefined
          // For example, set an appropriate error message or handle it accordingly
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      if (attractionOrderAllTickets) {
        const pdfBlob = new Blob([attractionOrderAllTickets], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attractionalltickets.pdf";
        a.click();
      }
      setSearch(false);
    }, [attractionOrderAllTickets]);

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
        orderId && getSuccessOrders();
      }
    }, [orderId]);

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

          {orderlist?.transferOrder?.journey?.map(
            (item: any, index: number) => (
              <>
                {item?.trips?.map((trip: any, index: number) => (
                  <div className="border rounded-lg mt-5 p-3">
                    <div
                      className={`flex items-center justify-between ${
                        briefTransfer === false ? "" : "border-b"
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
                        <p className="text-xl md:p-3 font-semibold">
                          {trip?.transferTo?.areaName}
                        </p>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span>Date</span>
                        <span className="capitalize font-semibold">
                          {format(new Date(trip?.pickupDate), "d MMM, yyyy")}
                        </span>
                      </div>

                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300 mb-3 md:mb-0">
                        <span>Time</span>
                        <span className="capitalize font-semibold">
                          {trip?.pickupTime}
                        </span>
                      </div>

                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <p className="text-lg border-b font-semibold">
                          Vehicle's
                        </p>
                      </div>
                      {trip?.vehicleTypes?.map(
                        (vehicleType: any, vehicleIn: number) => (
                          <div className="border p-2 rounded-lg mt-3 md:flex md:gap-5 items-center">
                            <div>
                              {vehicleType &&
                                vehicleType?.vehicleId?.image &&
                                vehicleType?.vehicleId?.image && (
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
                                <span className="capitalize font-semibold">
                                  {vehicleType?.name}
                                </span>
                              </div>
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Count</span>
                                <span className="capitalize font-semibold">
                                  {vehicleType?.count}
                                </span>
                              </div>
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Airport Occupancy</span>
                                <span className="capitalize font-semibold">
                                  {vehicleType?.vehicleId?.airportOccupancy}
                                </span>
                              </div>
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Normal Occupancy</span>
                                <span className="capitalize font-semibold">
                                  {vehicleType?.vehicleId?.normalOccupancy}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </>
            )
          )}
        </div>
      );
    };

    const renderSidebar = () => {
      return (
        <div className="flex flex-col gap-5 w-full">
          {orderlist && (
            <h1 className="text-xl font-semibold pb-2 border-b w-fit">Tours</h1>
          )}

          {orderlist?.attractionOrder?.activities.map(
            (item: any, i: number) => (
              <div key={item._id} className="rounded-lg border w-full md:p-3">
                <div className="md:flex md:gap-5 text-sm">
                  <div>
                    {item &&
                      item?.activity?.attraction?.images &&
                      item?.activity?.attraction?.images[0] && (
                        <Image
                          className="rounded-none max-h-[300px] w-full rounded-t-lg md:rounded-t-none md:mb-0 mb-3 cursor-pointer"
                          width={1000}
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

                    <div className="">
                      <div className="flex justify-between gap-5 items-center text-center">
                        <p>Download Invoice</p>
                        {/* <div onClick={() => getOrderInvoice(orderId || "")} className="cursor-pointer">
                      <ArrowDownOnSquareIcon width={20} height={20} />
                    </div> */}
                        <div className="cursor-pointer">
                          {invoice === false && (
                            <div
                              onClick={() => getOrderInvoice(orderId || "")}
                              className="cursor-pointer"
                            >
                              <ArrowDownOnSquareIcon width={20} height={20} />
                            </div>
                          )}

                          {invoice === true && (
                            <button type="button" className="-mr-1">
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline mr-2 w-4 h-4 text-gray-400 animate-spin dark:text-gray-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                ></path>
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="#1C64F2"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between gap-5  items-center text-center">
                        <p>Download Ticket</p>
                        <div className="cursor-pointer">
                          {search === false && (
                            <div
                              onClick={() =>
                                getAttractionAllTickets(
                                  orderlist?.attractionId,
                                  item?._id
                                )
                              }
                              className="cursor-pointer"
                            >
                              <ArrowDownOnSquareIcon width={20} height={20} />
                            </div>
                          )}

                          {search === true && (
                            <button type="button" className="-mr-1">
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline mr-2 w-4 h-4 text-gray-400 animate-spin dark:text-gray-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                ></path>
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="#1C64F2"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
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

            {/* {orderlist?.orderStatus !== "completed" && (
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Booking Failed 😔
          </h2>
        )} */}

            <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

            {/* ------------------------ */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Your booking</h3>
              <div className="sm:items-center">{renderSidebar()}</div>
              <div className="sm:items-center">{renderTransfer()}</div>
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
                    {orderlist?.createdAt
                      ? new Date(orderlist.createdAt).toDateString()
                      : ""}
                  </span>
                </div>
                <div className="flex text-neutral-6000 dark:text-neutral-300">
                  <span className="flex-1">Total</span>
                  <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                    {orderlist?.netPrice
                      ? priceConversion(
                          orderlist?.netPrice,
                          selectedCurrency,
                          true
                        )
                      : 0}
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
            <div className="flex flex-col gap-3">
              <DefaultLoader />
              <DefaultLoader />
              <DefaultLoader />
              <DefaultLoader />
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

export default PayPage;
