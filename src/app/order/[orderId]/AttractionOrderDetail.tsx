"use client";

import { RootState } from "@/redux/store";
import ButtonSecondary from "@/shared/ButtonSecondary";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import priceConversion from "@/utils/priceConversion";
import { OrderExcursion, OrderStatusExcEnum } from "@/data/attraction/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";

export interface OrderTemplateProps {
  data?: OrderExcursion;
  orderId?: string;
}

const AttractionOrderDetail: FC<OrderTemplateProps> = ({ data, orderId }) => {
  const [orderInvoice, setOrderInvoice] = useState<null | Blob>(null);
  const [attractionOrderAllTickets, setAttractionOrderAllTickets] =
    useState<null | Blob>(null);
  const [attractionOrderSingleTicket, setAttractionOrderSingleTicket] =
    useState<null | Blob>(null);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );
  const [search, setSearch] = useState(false);
  const [invoice, setInvoice] = useState(false);

  const { jwtToken } = useSelector((state: RootState) => state.users);

  //console.log(data?.transferOrder, "data");

  function formatDate(updatedAt: Date | string) {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
    } as Intl.DateTimeFormatOptions;
    const date = new Date(updatedAt);
    return date.toLocaleDateString("en-US", options);
  }

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

  // useEffect(() => {
  //   {
  //     orderId && getOrderInvoice(orderId);
  //   }
  // }, []);

  // const handleDownload = () => {
  //   if (orderInvoice) {
  //     const pdfBlob = new Blob([orderInvoice], {
  //       type: "application/pdf",
  //     });
  //     const url = URL.createObjectURL(pdfBlob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "orderInvoice.pdf";
  //     a.click();
  //   }
  // };

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

  const fetchAttractionAllTickets = async (
    attractionOrderId: string,
    activityId: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/${attractionOrderId}/ticket/${activityId}`,
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
    attractionOrderId: string,
    activityId: string
  ) {
    setSearch(true);
    try {
      const response = await fetchAttractionAllTickets(
        attractionOrderId,
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

  const handleDownloadSingleTicket = () => {
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
  };

  useEffect(() => {
    handleDownloadSingleTicket();
  }, [attractionOrderSingleTicket]);

  
  return (
    <div className="listingSection__wrap container mb-7">
      {!data && (
        <>
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
        </>
      )}

      {data && (
        <div className="text text-center">
          <div className="flex  w-full justify-center items-center text-center">
          <h1 className="text-3xl underline">Order Details</h1>
          </div>
          {data?.orderStatus === OrderStatusExcEnum.completed && (
          <div className="flex w-full justify-end">
              {invoice === false && (
                <button
                  onClick={() => getOrderInvoice(orderId || "")}
                  className="p-2  w-full md:w-fit mx-4 bg-primary-200 hover:bg-primary-400 cursor-pointer rounded font-semibold text-black"
                >
                  Download Invoice
                </button>
              )}

              {invoice === true && (
                <button
                  type="button"
                  className="p-2 dark:bg-neutral-900 dark:text-neutral-100 mt-6 min-w-[200px] w-full md:w-fit bg-primary-300  text-sm font-medium text-white self-center min-h-[50px] rounded dark:border-gray-600  flex justify-center items-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
                  Downloading...
                </button>
              )}
            </div>      
            )}      
      

          {data?.attractionOrder?.activities?.map(
            (activity: any, index: number) => (
              <div className="mt-10 md:flex md:justify-between p-4 md:p-2">
                <div className="bg-white border w-full md:flex gap-4 text-white font-semibold md:p-4  mb-5 md:mb-0 rounded-xl">
                  <div className="md:max-w-[300px] w-full">
                    <Image
                      className="rounded-none border-r-2 pr-3 max-h-[300px]  min-h-[200px] w-full rounded-t-xl md:rounded-t-none md:mb-0 mb-3 cursor-pointer"
                      width={1000}
                      height={100}
                      alt="picture 1"
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}${activity?.activity?.attraction?.images[0]}`}
                    />
                  </div>

                  <div className="text-black w-full px-4 md:px-0 pb-3 md:pb-0">
                    <p className="text-2xl my-3 md:block hidden md:my-0 border-b pb-1">
                      {activity?.activity?.attraction?.title}
                    </p>

                      <div className="flex md:hidden gap-2">
                        <p>Name:</p>
                        <p className="capitalize">
                        {activity?.activity?.attraction?.title}
                        </p>
                      </div>

                    <div className="md:flex md:justify-between md:mt-3 md:mb-5">
                      <div className="flex gap-2">
                        <p>Country:</p>
                        <p className="capitalize">
                          {activity?.activity?.attraction?.destination?.name}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <p>Transfer Type:</p>
                        <p className="capitalize">{activity?.transferType}</p>
                      </div>
                    </div>

                    <div className="md:flex md:justify-between md:mb-5">
                      <div className="flex gap-2">
                        <p>Adult Count:</p>
                        <p className="capitalize">{activity?.adultsCount}</p>
                      </div>

                      <div className="flex gap-2">
                        <p>Children Count:</p>
                        <p className="capitalize">{activity?.childrenCount}</p>
                      </div>

                      <div className="flex gap-2">
                        <p>Date:</p>
                        <p>
                          {new Date(activity?.date).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>

                    <div className="md:flex md:justify-between items-center text-center">
                      <div className="flex gap-2">
                        <p>Grand Total:</p>
                        <p className="capitalize">
                          {priceConversion(
                            activity?.grandTotal,
                            selectedCurrency,
                            true
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <p>Status:</p>
                        <p className="capitalize">{activity?.status}</p>
                      </div>

                      {data?.orderStatus === OrderStatusExcEnum.completed && (activity?.status === "booked" || activity?.status === "completed" || activity?.status === "pending") && (
                      <div>
                        <div className="w-full flex justify-center">
                          {search === false && (
                            <button
                              onClick={() =>
                                getAttractionAllTickets(
                                  data?.attractionId,
                                  activity?._id
                                )
                              }
                              className="md:px-2 md:py-1 px-2 py-2  mt-5 md:mt-0 w-full md:w-fit bg-primary-200 hover:bg-primary-400 cursor-pointer rounded font-semibold text-black"
                            >
                              Download Ticket
                            </button>
                          )}

                          {search === true && (
                            <button
                              type="button"
                              className="px-2 py-1 mt-5 md:mt-0  dark:bg-neutral-900 dark:text-neutral-100 min-w-[200px] w-full md:w-fit bg-primary-300  text-sm font-medium text-white self-center min-h-[50px] rounded dark:border-gray-600  flex justify-center items-center"
                            >
                              <svg
                                aria-hidden="true"
                                role="status"
                                className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
                              Downloading...
                            </button>
                          )}
                        </div>
                      </div>
                      )}



                    </div>
                  </div>
                </div>
                {/* <ButtonPrimary onClick={() => getAttractionAllTickets(data?.attractionId, activity?._id, )}>Download Ticket</ButtonPrimary> */}
              </div>
            )
          )}

          {data?.transferOrder?.journey?.map(
            (journeyItem: any, index: number) => (
              <>
                {journeyItem?.trips?.map((trip: any, index: number) => (
                  <div className="mt-10 md:flex md:justify-between p-2 md:p-0">
                    <div className=" w-full text-white font-semibold md:p-4 p-2 mb-5 md:mb-0 rounded-xl">
                      <div className="text-black flex justify-between w-full mb-5">
                        <div className="text-left">
                          <p className="text-2xl">
                            {" "}
                            {trip?.transferFrom?.airportName ||
                              trip?.transferFrom?.name ||
                              trip?.transferFrom?.areaName}
                          </p>
                          <p className="text-gray-400">Pickup Location</p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl">
                            {trip?.transferTo?.name ||
                              trip?.transferTo?.airportName ||
                              trip?.transferTo?.areaName}
                          </p>
                          <p className="text-gray-400">Drop Location</p>
                        </div>
                      </div>

                      <div className="text-black mb-5   border-black flex justify-between w-full">
                        <div className="text-left">
                          <p className="text-xl">
                            {new Date(trip?.pickupDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                          <p className="text-gray-400">Pickup Date</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl">{trip?.pickupTime}</p>
                          <p className="text-gray-400">Pickup Time</p>
                        </div>
                      </div>


                      <div className="text-black mb-5 border-b pb-5 border-black flex justify-between w-full">
                        <div className="text-left">
                          <p className="text-xl">
                           {data?.orderStatus}
                          </p>
                          <p className="text-gray-400">Order Status</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl">{data?.paymentState}</p>
                          <p className="text-gray-400">Payment State</p>
                        </div>
                      </div>

                      <div className="text-black">
                        <p className="text-2xl underline mb-10">Vehicles</p>
                        <div className="">
                          {trip?.vehicleTypes?.map((vehicle: any) => (
                            <div className="flex rounded border gap-10 py-2 px-8 w-fit items-center text-center">
                              <div className="max-w-[200px]">
                                <Image
                                  className="rounded-lg cursor-pointer"
                                  width={1000}
                                  height={100}
                                  alt="picture 1"
                                  src={`${process.env.NEXT_PUBLIC_CDN_URL}${vehicle?.vehicleId?.image}`}
                                />
                              </div>

                              <div>
                                <div className="flex gap-5 md:text-xl">
                                  <p className="font-thin">Name:</p>
                                  <p className="capitalize">{vehicle?.name}</p>
                                </div>

                                <div className="flex gap-5  md:text-xl">
                                  <p className="font-thin">Price:</p>
                                  <p className="capitalize">
                                    {priceConversion(
                                      trip?.tripPrice,
                                      selectedCurrency,
                                      true
                                    )}
                                  </p>
                                </div>

                                <div className="flex gap-5  md:text-xl">
                                  <p className="font-thin">Airport Occupancy:</p>
                                  <p className="capitalize">
                                    {vehicle?.vehicleId?.airportOccupancy}
                                  </p>
                                </div>

                                <div className="flex gap-5  md:text-xl">
                                  <p className="font-thin">Normal Occupancy:</p>
                                  <p className="capitalize">
                                    {vehicle?.vehicleId?.normalOccupancy}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )
          )}

          <div className="flex gap-5">
           

            {/* <div className="w-full flex justify-center">
            {search === false && (
              <button            
                className="p-2 mt-5 bg-primary-200 hover:bg-primary-400 cursor-pointer rounded font-semibold text-black"
              >
                Download Ticket
              </button>
            )}

            {search === true && (
              <button
                type="button"
                className="p-2 dark:bg-neutral-900 dark:text-neutral-100 mt-6 min-w-[200px] w-full md:w-fit bg-primary-300  text-sm font-medium text-white self-center min-h-[50px] rounded dark:border-gray-600  flex justify-center items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
                Downloading...
              </button>
            )}
          </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionOrderDetail;
