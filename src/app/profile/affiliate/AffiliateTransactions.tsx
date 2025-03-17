"use client"

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import priceConversion from "@/utils/priceConversion";

export interface AffiliateTransactionsPageProps {}

interface AffiliateTrans {
  points: string;
  amount: number;
  currency: string;
  createdAt: string;
  redeemOption: string;
  status: string;
  network: string;
  transactionNo: string;
  feeDeduction: number;
}


const AffiliateTransactions = () => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const { selectedCurrency } = useSelector((state: RootState) => state.initials);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [affiliateTransHistory, setAffiliateTransHistory] = useState<AffiliateTrans[]>([]);
  const [transactionCategory, setTransactionCategory] = useState("redeem");

    const affiliateTransaction = async () => {
      try {
        const affiliateTrans = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/redeem/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        return affiliateTrans.json();
      } catch (error) {
        console.log(error);
      }
    };

    async function getAffiliateTransHistory() {
      try {
        const response = await affiliateTransaction();
         setAffiliateTransHistory(response?.affiliateRequests);
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      {
        jwtToken && getAffiliateTransHistory()
      }
    },[])
    

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Transactions / History</h2>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li
              onClick={() => setTransactionCategory("redeem")}
              className="mr-2 cursor-pointer"
            >
              <a
                className={`${
                    transactionCategory === "redeem"
                    ? "text-primary-6000"
                    : "text-neutral-3000"
                } ${
                    transactionCategory === "redeem"
                    ? "border-primary-6000"
                    : "border-neutral-3000"
                } inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
              >
                Redeem History
              </a>
            </li>
            {/* <li
              onClick={() => setTransactionCategory("withdrawal")}
              className="mr-2 cursor-pointer"
            >
              <a
                className={`${
                    transactionCategory === "withdrawal"
                    ? "text-primary-6000"
                    : "text-neutral-3000"
                } ${
                    transactionCategory === "withdrawal"
                    ? "border-primary-6000"
                    : "border-neutral-3000"
                } inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
              >
             Withdrawal History
              </a>
            </li> */}
          </ul>
        </div>
      <div className="flex flex-col md:flex-col">
        {transactionCategory === "redeem" && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Redeem Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount Credited
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fee Deduction
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                {affiliateTransHistory?.map((trans, index) => (
                <tbody>
                  <tr className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                     {trans?.points} Points
                    </th>
                    <td className="px-6 py-4">{priceConversion(trans?.amount || 0, selectedCurrency, true)}</td>
                    <td className="px-6 py-4">{priceConversion(trans?.feeDeduction || 0, selectedCurrency, true)}</td>
                    <td className="px-6 py-4"> {trans?.createdAt
                                ? new Date(trans.createdAt)
                                    .toISOString()
                                    ?.split("T")[0]
                                    .replace(/-/g, "/")
                                : ""}</td>
                    <td className="px-6 py-4">{trans?.status}</td>
                  </tr>
                </tbody>
                ))}
              </table>
            </div>
          </div>
        )}

        {transactionCategory === "withdrawal" && (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {/* <th scope="col" className="px-6 py-3">
                      Withdrawal Method & Network
                    </th> */}
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Transaction Id
                    </th>
                  </tr>
                </thead>
                {affiliateTransHistory?.map((trans, index) => (
                <tbody>
                  <tr className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {/* <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                    {trans?.redeemOption} ({trans?.network})
                    </th> */}
                    <td className="px-6 py-4">{trans?.amount} {trans?.currency}</td>
                    <td className="px-6 py-4">{trans?.status}</td>
                    <td className="px-6 py-4">{trans?.transactionNo}</td>
                  </tr>
                </tbody>
                ))}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateTransactions;