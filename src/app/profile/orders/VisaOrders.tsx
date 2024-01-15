"use client";

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SkeletonLoader from "./SkeletonLoader";
import priceConversion from "@/utils/priceConversion";
import Link from "next/link";

export interface VisaOrdersPageProps {}

interface OrderList {
  _id: string;
  referenceNumber: number;
  createdAt: string;
  status: string;
  visa: string;
  totalPrice: number;
  travellers: {
    title: string;
    firstName: string;
    lastName: string;
    passportNo: number;
    dateOfBirth: {
      day: string;
      month: string;
      year: string;
    };
    expiryDate: {
      day: string;
      month: string;
      year: string;
    };
  };
}

const VisaOrders = () => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const [orderlist, setOrderList] = useState<OrderList[]>([]);
  const [loader, setLoader] = useState(false);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );

  const attractionsOrders = async () => {
    setLoader(true);
    try {
      const visaDetails = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/application/list`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return visaDetails.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getAttractionsOrders() {
    try {
      const response = await attractionsOrders();
      setLoader(false);
      setOrderList(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      jwtToken && getAttractionsOrders();
    }
  }, []);
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Visa Orders</h2>
      {orderlist.length === 0 && loader === false && (
          <div>
          <h2>You haven't placed any orders yet.</h2>
        </div>
      )}
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {orderlist.length > 0 && (
        <div className="flex flex-col md:flex-col gap-4 md:gap-0">
          {orderlist?.map((visa, index) => (
            <Link href={`/order/visa/${visa?._id}`}>
            <div key={index} className="nc-PropertyCardH group p-4 relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700 rounded-3xl overflow-x-auto mt-4">
              <div className="md:flex md:justify-between mb-3">
                <div className="flex gap-4">
                  <p>Ref No:</p>
                  <p>{visa?.referenceNumber}</p>
                </div>
                <p className="mt-4 md:mt-0">
                  {new Date(visa?.createdAt).toDateString()}
                </p>
              </div>
          

              <div className="md:flex md:justify-between mb-3">
                <div className="flex gap-4">
                  <p>Name:</p>
                  <p>
                    {visa?.travellers?.title?.toUpperCase()}{" "}
                    {visa?.travellers?.firstName?.toUpperCase()}{" "}
                    {visa?.travellers?.lastName?.toUpperCase()}
                  </p>
                </div>

                <div className="flex gap-4">
                  <p>DOB:</p>
                  <p>
                    {visa?.travellers?.dateOfBirth?.day}/
                    {visa?.travellers?.dateOfBirth?.month}/
                    {visa?.travellers?.dateOfBirth?.year}
                  </p>
                </div>
              </div>
              <div className="md:flex md:justify-between mb-3">
                <div className="flex gap-4">
                  <p>Passport No:</p>
                  <p>{visa?.travellers?.passportNo}</p>
                </div>

                <div className="flex gap-4">
                  <p>Passport Expiry:</p>
                  <p>
                    {visa?.travellers?.expiryDate?.day}/
                    {visa?.travellers?.expiryDate?.month}/
                    {visa?.travellers?.expiryDate?.year}
                  </p>
                </div>
              </div>

              <div className="md:flex md:justify-between">
                <div className="flex gap-4">
                  <p>Status:</p>
                  <p>{visa?.status}</p>
                </div>
                <div className="flex gap-4">
                  <p>Total Amount:</p>
                  <p>
                    {priceConversion(visa?.totalPrice, selectedCurrency, true)}
                  </p>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}

      {loader === true && (
        <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      )}
    </div>
  );
};

export default VisaOrders;
