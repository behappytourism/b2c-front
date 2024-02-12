"use client";

import React, { useState } from "react";
import { TruckIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { handleAddtocart, setAlertSuccess } from "@/redux/features/transferSlice";
import { TransferExcursion } from "@/data/transfer/types";
import priceConversion from "@/utils/priceConversion";

function TransferList() {
  const thisPathname = usePathname();
  const [count, setCount] = useState(1);

  const dispatch = useDispatch();
  const route = useRouter();
  const { transfer, transferCart } = useSelector(
    (state: RootState) => state.transfer
  );
  const { countries, selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );

  const parts = thisPathname?.split("/").filter((part) => part !== "");
  let link = "";
  const breadcrum: BreadcrumbsList[] = parts.map((item) => {
    link += `/${item}`;
    return {
      name: item,
      link: link,
      classNames: "",
    };
  });

  const handleCountChange = (e: any) => {
    setCount(e.target.value);
  };

  // localStorage.removeItem("TransferCart");

  console.log(transfer);

  const handleAddToCart = (
    vehicle: any,
    trip: any,
    transfer: TransferExcursion
  ) => {
    const selectedTransferItem = {
      _id: vehicle?._id,
      date: trip?.date,
      time: trip?.time,
      transferType: transfer?.transferType,
      noOfAdults: transfer?.noOfAdults,
      noOfChildrens: transfer?.noOfChildrens,
      pickupSuggestionType: transfer?.pickupSuggestionType,
      pickupLocation:
        trip?.transferFrom?.airportName ||
        trip?.transferFrom?.name ||
        trip?.transferFrom?.areaName,
      pickupLocationId: transfer?.pickupLocation || trip?.transferFrom?._id,
      dropOffSuggestionType: transfer?.dropOffSuggestionType,
      dropOffLocation:
        trip?.transferTo?.name ||
        trip?.transferTo?.airportName ||
        trip?.transferTo?.areaName,
      dropOffLocationId: transfer?.dropOffLocation || trip?.transferTo?._id,
      returnDate: transfer?.returnDate || "",
      returnTime: transfer?.returnTime || "",

      vehicle: {
        count: count,
        name: vehicle?.vehicle?.name,
        price: vehicle?.price,
        vehicleId: vehicle?.vehicle?._id,
        vehicleType: vehicle?.vehicle?.vehicleType,
      },
    };
    dispatch(handleAddtocart([selectedTransferItem]));
    dispatch(
      setAlertSuccess({
        status: true,
        title: "Success",
        text: "The item is added to the cart",
      })
    );
    // console.log(selectedTransferItem, 'selected transfer item');
  };

  const handleCheckout = (
    vehicle: any,
    trip: any,
    transfer: TransferExcursion
  ) => {
    const selectedTransferItem = {
      _id: vehicle?._id,
      date: trip?.date,
      time: trip?.time,
      transferType: transfer?.transferType,
      noOfAdults: transfer?.noOfAdults,
      noOfChildrens: transfer?.noOfChildrens,
      pickupSuggestionType: transfer?.pickupSuggestionType,
      pickupLocation:
        trip?.transferFrom?.airportName ||
        trip?.transferFrom?.name ||
        trip?.transferFrom?.areaName,
      pickupLocationId: transfer?.pickupLocation || trip?.transferFrom?._id,
      dropOffSuggestionType: transfer?.dropOffSuggestionType,
      dropOffLocation:
        trip?.transferTo?.name ||
        trip?.transferTo?.airportName ||
        trip?.transferTo?.areaName,
      dropOffLocationId: transfer?.dropOffLocation || trip?.transferTo?._id,
      returnDate: transfer?.returnDate || "",
      returnTime: transfer?.returnTime || "",

      vehicle: {
        count: count,
        name: vehicle?.vehicle?.name,
        price: vehicle?.price,
        vehicleId: vehicle?.vehicle?._id,
        vehicleType: vehicle?.vehicle?.vehicleType,
      },
    };
    dispatch(handleAddtocart([selectedTransferItem]));
    route.push("/cart");
    // console.log(selectedTransferItem, 'selected transfer item');
  };

  return (
    <div className="container p-5 my-20">
      <div className="mb-3">
        <Breadcrumb breadCrumbs={breadcrum} />
      </div>

      {transfer?.map((transferItem: TransferExcursion, index: number) => (
        <div className="border rounded-lg p-5">
          {transfer[0].error && (
            <div className="flex gap-3">
              <p className="text-red-500">Error:</p>
              <p>{transferItem?.error}</p>
            </div>
          )}
          {transferItem.trips?.map((trip: any, tripIndex: number) => (
            <div className="mb-10 border-b pb-10">
              <div className="border-b mb-3">
                <div className="flex justify-between p-1">
                  <div className="">
                    <p className="text-gray-400 text-sm">Pickup Location</p>
                    <h1 className="text-xl font-semibold">
                      {trip?.transferFrom?.airportName ||
                        trip?.transferFrom?.name ||
                        trip?.transferFrom?.areaName}
                    </h1>
                  </div>

                  <div className="">
                    <p className="text-gray-400 text-sm flex justify-end">
                      Drop Location
                    </p>
                    <h1 className="text-xl font-semibold">
                      {trip?.transferTo?.name ||
                        trip?.transferTo?.airportName ||
                        trip?.transferTo?.areaName}
                    </h1>
                  </div>
                </div>

                <div className="flex justify-between p-1">
                  <div className="text-sm flex gap-3">
                    <p className="text-gray-400 text-sm">
                      Estimate Time Arrival (ETA)
                    </p>
                    <p className="font-semibold">{trip?.time}</p>
                  </div>

                  <div className="text-sm flex gap-3">
                    <p className="text-gray-400 text-sm">Booked for</p>
                    <p className="font-semibold">{trip?.date}</p>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-semibold mt-5 mb-3 border-b w-fit">
                Vehicles
              </h1>
              <div className="grid grid-cols-4 gap-5">
                {trip?.vehicles?.map((vehicle: any, index: number) => (
                  <div className="border w-fit cursor-pointer  bg-slate-100 transform hover:scale-110 transition-transform duration-300">
                    <div className="object-cover border-b px-10 items-center flex justify-center">
                      <Image
                        alt="photos"
                        className="min-h-[100px]"
                        src={
                          `${
                            process.env.NEXT_PUBLIC_SERVER_URL +
                            vehicle?.vehicle?.image
                          }` || ""
                        }
                        width={200}
                        height={100}
                      />
                    </div>
                    <div className="p-5">
                      <p className="font-semibold text-lg flex justify-center">
                        {vehicle?.vehicle?.name}
                      </p>
                      <div className="flex gap-2">
                        <p className="text-gray-400 font-medium">Price:</p>
                        <p className="font-semibold">
                          {priceConversion(
                            vehicle?.price,
                            selectedCurrency,
                            true
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <p className="text-gray-400 font-medium">
                          Vehicle Type:
                        </p>
                        <p className="font-semibold">
                          {vehicle?.vehicle?.vehicleCategoryId?.categoryName}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <p className="text-gray-400 font-medium">Occupancy:</p>
                        <p className="font-semibold">
                          {vehicle?.vehicle?.normalOccupancy}
                        </p>
                      </div>

                      <div className="">
                        <p className="text-gray-400 font-medium">
                          Select Quantity:
                        </p>
                        <select
                          onChange={(e) => setCount(parseInt(e.target.value))}
                          className="border p-2 w-full max-h-[50px] border-gray-300"
                        >
                          {Array.from({ length: 5 }).map((val, ind) => (
                            <option value={ind + 1}>{ind + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col mt-3 gap-3 font-semibold">
                        <button
                          onClick={() =>
                            handleAddToCart(vehicle, trip, transferItem)
                          }
                          className="border p-2 border-orange-500 text-orange-500 hover:border-orange-700 hover:text-orange-700"
                        >
                          Add To Cart
                        </button>
                        <button
                          onClick={() =>
                            handleCheckout(vehicle, trip, transferItem)
                          }
                          className="border p-2 hover:bg-orange-700 bg-orange-500  text-white"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="w-full flex justify-end mt-5">
        <Link href={"/cart"}>
          <ButtonPrimary className="min-w-[2 00px]">Checkout</ButtonPrimary>
        </Link>
      </div>
    </div>
  );
}

export default TransferList;
