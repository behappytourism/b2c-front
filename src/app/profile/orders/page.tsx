"use client";
import React, { useEffect, useState } from "react";

import AttractionOrders from "./AttractionOrders";
import VisaOrders from "./VisaOrders";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
export interface OrderPageProps {}

interface userRootState {
  users: {
    user: {
      name: string;
      email: string;
      country: string;
      phoneNumber: number;
    };
    jwtToken: string;
    isLoggedIn: boolean;
  };
}

const Orders = () => {
  const router = useRouter();
  const [ordersCategory, setOrdersCategory] = useState<"attraction" | "visa">(
    "attraction"
  );
  const { user, jwtToken } = useSelector((state: userRootState) => state.users);

  useEffect(() => {
    if (!user?.name) {
      router.push("/");
    }
  }, []);

  return (
    <div className={`nc-AuthorPage `}>
      {/* <div className="w-full  space-y-8 lg:space-y-10 flex-shrink-0">
        <h2 className="text-3xl font-semibold">Orders</h2>
        <div className="flex flex-col md:flex-row">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li
                onClick={() => setOrdersCategory("attraction")}
                className="mr-2 cursor-pointer"
              >
                <a
                  className={`${
                    ordersCategory === "attraction"
                      ? "text-primary-6000"
                      : "text-neutral-6000"
                  } ${
                    ordersCategory === "attraction"
                      ? "border-primary-6000"
                      : "border-neutral-6000"
                  } inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                >
                  Attractions
                </a>
              </li>
              <li
                onClick={() => setOrdersCategory("visa")}
                className="cursor-pointer"
              >
                <a
                  className={`${
                    ordersCategory === "visa"
                      ? "text-primary-6000"
                      : "text-neutral-6000"
                  } ${
                    ordersCategory === "visa"
                      ? "border-primary-6000"
                      : "border-neutral-6000"
                  } inline-block p-4  border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                >
                  Visas
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          {ordersCategory === "attraction" && <AttractionOrders />}
          {ordersCategory === "visa" && <VisaOrders />}
        </div>
      </div> */}
       <AttractionOrders />
    </div>
  );
};

export default Orders;
