"use client";

import { RootState } from "@/redux/store";
import ButtonSecondary from "@/shared/ButtonSecondary";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import priceConversion from "@/utils/priceConversion";
import { OrderExcursion } from "@/data/attraction/types";
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
    {
      orderId && getOrderInvoice(orderId);
    }
  }, []);

  const handleDownload = () => {
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
  };

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

  const handleDownloadAllTickets = () => {
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
  };

  useEffect(() => {
    handleDownloadAllTickets();
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
          <h1 className="text-3xl">Order Details</h1>

          {data?.attractionOrder?.activities?.map(
            (activity: any, index: number) => (
              <div className="mt-10 md:flex md:justify-between p-2 md:p-0">
                <div className="bg-white border w-full md:flex gap-10 text-white font-semibold md:p-4 p-2 mb-5 md:mb-0 rounded-xl">
                  <div className="md:max-w-[300px] w-full">
                    <Image
                      className="md:rounded-lg rounded-2xl cursor-pointer"
                      width={1000}
                      height={1000}
                      alt="picture 1"
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}${activity?.activity?.attraction?.images[0]}`}
                    />
                  </div>

                  <div className="text-black w-full">
                    <p className="text-2xl my-3 md:my-0 underline">
                      {activity?.activity?.attraction?.title}
                    </p>

                    <div className="md:flex md:justify-between md:mb-10">
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

                    <div className="md:flex md:justify-between md:mb-10">
                      <div className="flex gap-2">
                        <p>Adult Count:</p>
                        <p className="capitalize">{activity?.adultsCount}</p>
                      </div>

                      <div className="flex gap-2">
                        <p>Children Count:</p>
                        <p className="capitalize">{activity?.childrenCount}</p>
                      </div>
                    </div>

                    <div className="md:flex md:justify-between">
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

                      <div className="flex gap-2">
                        <p>Date:</p>
                        <p>
                          {new Date(activity?.date).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {data?.transferOrder?.journey?.map(
            (journeyItem: any, index: number) => (
              <>
                {journeyItem?.trips?.map((trip: any, index: number) => (
                  <div className="mt-10 md:flex md:justify-between p-2 md:p-0">
                    <div className="bg-primary-200 w-full text-white font-semibold md:p-4 p-2 mb-5 md:mb-0 rounded-xl">
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

                      <div className="text-black mb-5 border-b pb-5 border-black flex justify-between w-full">
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

                      <div className="text-black">
                        <p className="text-2xl underline mb-10">Vehicles</p>
                        <div className="grid grid-cols-2 justify-between">
                          {trip?.vehicleTypes?.map((vehicle: any) => (
                            <div className="flex border-black shadow-2xl rounded border gap-10 p-2 w-fit items-center text-center">
                              <div className="max-w-[300px]">
                                <Image
                                  className="rounded-lg cursor-pointer"
                                  width={150}
                                  height={100}
                                  alt="picture 1"
                                  src={`${process.env.NEXT_PUBLIC_CDN_URL}${vehicle?.vehicleId?.image}`}
                                />
                              </div>

                              <div>
                                <div className="flex gap-2">
                                  <p>Name:</p>
                                  <p className="capitalize">{vehicle?.name}</p>
                                </div>

                                <div className="flex gap-2">
                                  <p>Price:</p>
                                  <p className="capitalize">
                                    {priceConversion(
                                      trip?.tripPrice,
                                      selectedCurrency,
                                      true
                                    )}
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <p>Airport Occupancy:</p>
                                  <p className="capitalize">
                                    {vehicle?.vehicleId?.airportOccupancy}
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <p>Normal Occupancy:</p>
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

          <div className="w-full flex justify-center">
            <button
              onClick={() => handleDownload()}
              className="p-2 mt-5 bg-primary-200 hover:bg-primary-400 cursor-pointer rounded font-semibold text-black"
            >
              Download Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionOrderDetail;
