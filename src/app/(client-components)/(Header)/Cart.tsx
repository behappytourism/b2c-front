"use client";

import { changeCurrencyInitials } from "@/redux/features/initialsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import priceConversion from "@/utils/priceConversion";
import { handleRemoveFromCart } from "@/redux/features/attractionSlice";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "next";
import { format } from "date-fns";
interface CartProps {
  className: string;
}

const Cart: FC<CartProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { cart } = useSelector((state: RootState) => state.attraction);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );

  const [price, setPrice] = useState(0);

  useEffect(() => {
    const sum = cart?.reduce((acc, data) => {
      return Number(acc) + Number(data?.grandTotal);
    }, 0);
    setPrice(sum);
  }, [cart]);

  return (
    <React.Fragment>
      <Popover className={`relative ${className}`}>
        {({ open, close }) => {
          return (
            <>
              {cart?.length > 0 && (
                <div className="bg-primary-6000  flex justify-center text-center mb-1 h-4 w-4 rounded-full">
                  <p className="text-[11px] text-white self-center text-center">
                    {cart?.length}
                  </p>
                </div>
              )}
              <Popover.Button className="text-2xl md:text-[28px] -ml-3 w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
                <ShoppingCartIcon
                  color="black"
                  className="h-9 w-9 flex self-center px-1 dark:text-white"
                />
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  static
                  className="absolute right-0 z-50 max-h-[500px] overflow-x-auto top-full w-screen max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-xl border dark:border-neutral-700"
                >
                  {cart?.length ? (
                    <>
                      {cart?.map((item, index) => (
                        <div className="p-2">
                          <div className="shadow-2xl p-5 rounded-xl flex justify-between">
                            <div className="flex flex-col gap-1">
                              <p className="font-medium">{item?.name}</p>
                              <p>
                                Date:{" "}
                                {/* {new Date(item?.date).toISOString().split("T")[0]} */}
                                {format(new Date(item?.date), "d MMM, yyyy")}
                              </p>
                              <div className="flex gap-2">
                                <p>{item?.adultCount}</p>
                                <UserIcon
                                  color="black"
                                  className="h-5 w-5 flex self-center dark:text-white"
                                />
                                {priceConversion(
                                  item?.adultPrice,
                                  selectedCurrency,
                                  true
                                )}
                              </div>
                              {item?.childCount > 0 && (
                                <div className="flex gap-2">
                                  <p>{item?.childCount}</p>
                                  <UserIcon
                                    color="black"
                                    className="h-5 w-5 flex self-center dark:text-white"
                                  />
                                  {priceConversion(
                                    item?.childPrice,
                                    selectedCurrency,
                                    true
                                  )}
                                </div>
                              )}

                              {item?.infantCount > 0 && (
                                <div className="flex gap-2">
                                  <p>{item?.infantCount}</p>
                                  <UserIcon
                                    color="black"
                                    className="h-5 w-5 flex self-center dark:text-white"
                                  />
                                  {priceConversion(
                                    item?.infantPrice,
                                    selectedCurrency,
                                    true
                                  )}
                                </div>
                              )}
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                dispatch(handleRemoveFromCart(item?._id));
                              }}
                            >
                              <XMarkIcon
                                color="black"
                                className="h-5 w-5 flex self-center dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="p-2">
                        <div className="shadow-2xl rounded-xl flex justify-between p-5">
                          <p>Grand Total:</p>
                          {priceConversion(price, selectedCurrency, true)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex justify-start h-full items-center px-4 py-7">
                      <p className="font-mono text-lg tracking-wide text-gray-500">Sorry! You didn't add any yet.</p>
                    </div>
                  )}
                  <div className="p-2">
                    <ButtonPrimary
                      onClick={() => {
                        close();
                      }}
                      disabled={cart?.length === 0}
                      href={cart?.length > 0 ? "/attraction/checkout" as Route : "/"} className="w-full mb-3">
                      {cart?.length > 0 ? "Checkout" : "Shop Now"}
                    </ButtonPrimary>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </React.Fragment>
  );
};

export default Cart;
