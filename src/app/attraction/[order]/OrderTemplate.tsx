"use client";

import { RootState } from "@/redux/store";
import ButtonSecondary from "@/shared/ButtonSecondary";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import priceConversion from "@/utils/priceConversion";
import { OrderExcursion } from "@/data/attraction/types";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface OrderTemplateProps {
  data?: OrderExcursion;
}

const OrderTemplate: FC<OrderTemplateProps> = ({ data }) => {
  const [attractionOrderInvoice, setAttractionOrderInvoice] =
    useState<null | Blob>(null);
  const [attractionOrderAllTickets, setAttractionOrderAllTickets] =
    useState<null | Blob>(null);
  const [attractionOrderSingleTicket, setAttractionOrderSingleTicket] =
    useState<null | Blob>(null);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );

  const { jwtToken } = useSelector((state: RootState) => state.users);

  function formatDate(updatedAt: Date | string) {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
    } as Intl.DateTimeFormatOptions;
    const date = new Date(updatedAt);
    return date.toLocaleDateString("en-US", options);
  }

  const fetchAttractionInvoice = async (attractionOrderId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/invoice/${attractionOrderId}`,
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

  async function getAttractionInvoice(attractionOrderId: string) {
    try {
      const response = await fetchAttractionInvoice(attractionOrderId);

      if (response) {
        setAttractionOrderInvoice(response);
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
      data?._id && getAttractionInvoice(data?._id);
    }
  }, [data?._id]);

  const handleDownload = () => {
    if (attractionOrderInvoice) {
      const pdfBlob = new Blob([attractionOrderInvoice], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attractioninvoice.pdf";
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

  // useEffect(() => {
  //   {
  //     data?._id && getAttractionAllTickets(data?._id, data?.activities[0]?._id);
  //   }
  // }, [data?._id]);

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

  //   useEffect(() => {
  //   {
  //     data?._id && getAttractionAllTickets(data?._id, data?.activities[0]?._id);
  //   }
  // }, [data?._id]);

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
          <h1 className="text-3xl hidden md:block">THANK YOU FOR YOUR ORDER</h1>
          <h1 className="text-3xl md:hidden">
            THANK YOU <br /> FOR YOUR ORDER
          </h1>
          <p className="md:block hidden">
            Wohoo! Your payment was successful, and your order is complete.
          </p>
          <p className="md:hidden">
            Wohoo! Your payment was successful, <br /> and your order is
            complete.
          </p>
          {data?.activities?.map((activity, index) => (
            <div className="mt-10 md:flex md:justify-between p-2 md:p-0">
              <div className="bg-primary-6000 md:w-7/12 text-white font-semibold md:p-4 p-2 mb-5 md:mb-0 rounded-xl">
                <div className="md:flex md:justify-between text-left">
                  <div>
                    <p>{activity?.attraction?.title}</p>
                    <p>
                      {activity?.bookingType.charAt(0).toUpperCase()}
                      {activity?.bookingType?.slice(1)}
                    </p>

                    <div className="flex gap-4 md:mt-8 mt-4">
                      <div className="text-center w-fit">
                        <p>Adults</p>
                        <p className="ttnc-ButtonSecondary px-2 rounded-xl font-medium border bg-white border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          {activity?.adultsCount} Adults
                        </p>
                      </div>
                      <div className="text-center w-fit">
                        <p>Childrens</p>
                        <p className="ttnc-ButtonSecondary px-2 rounded-xl font-medium border bg-white border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          {activity?.childrenCount} Childrens
                        </p>
                      </div>
                      <div className="text-center w-fit">
                        <p>Infants</p>
                        <p className="ttnc-ButtonSecondary px-2 rounded-xl font-medium border bg-white border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          {activity?.infantCount} Infants
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:text-right md:mt-0 mt-4">
                    <p>{activity?.transferType} transfer</p>
                    <p>{formatDate(data?.updatedAt)}</p>

                    <div className="md:mt-8 mt-4">
                      <p>Grand Total</p>
                      <p>
                        {priceConversion(
                          data?.totalAmount,
                          selectedCurrency,
                          true
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 mt-3">
                  {activity?.adultTickets?.map((adt, i) => (
                    <>
                      <div className="md:flex items-center md:gap-5 mt-3">
                        <p>Adult {i + 1}</p>
                        <ButtonSecondary
                        className="w-full md:w-fit"
                          onClick={() =>
                            getAttractionSingleTicket(
                              data?._id,
                              activity?._id,
                              adt?.ticketNo
                            )
                          }
                        >
                          Download Ticket
                        </ButtonSecondary>
                      </div>
                    </>
                  ))}
                </div>

                {activity?.childTickets?.length > 0 && (
                <div className="grid grid-cols-2 mt-3">
                  {activity?.childTickets?.map((chd, i) => (
                    <>
                      <div className="md:flex items-center md:gap-5 mt-3">
                        <p>Child {i + 1}</p>
                        <ButtonSecondary
                        className="w-full md:w-fit"
                          onClick={() =>
                            getAttractionSingleTicket(
                              data?._id,
                              activity?._id,
                              chd?.ticketNo
                            )
                          }
                        >
                          Download Ticket
                        </ButtonSecondary>
                      </div>
                    </>
                  ))}
                </div>
                )}
              </div>

              <div className="bg-primary-6000 md:w-3/12 text-white font-semibold p-4 rounded-xl">
                <div
                  className={`flex flex-col md:block ${
                    data?.activities[0]?.bookingType === "ticket"
                      ? "md:mt-7"
                      : "md:mt-5"
                  }`}
                >
                  <p>{activity?.attraction?.title}</p>
                  <div className="">
                    <ButtonSecondary
                      onClick={handleDownload}
                      className="md:mt-2 mt-4 w-full md:w-fit"
                    >
                      Download Invoice
                    </ButtonSecondary>
                  </div>

                  {activity?.bookingType === "ticket" && (
                    <div className="">
                      <ButtonSecondary
                        onClick={() =>
                          getAttractionAllTickets(data?._id, activity?._id)
                        }
                        className="md:mt-2 mt-4 w-full md:w-fit"
                      >
                        Download All Tickets
                      </ButtonSecondary>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTemplate;
