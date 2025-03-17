"use client";

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { setAffiliateUser } from "@/redux/features/affiliatesSlice";
import priceConversion from "@/utils/priceConversion";

export interface AffiliateSettingsPageProps {}

export interface AffiliateRootState {
  affiliateUsers: {
    affiliateUser: {
      affiliateCode: number;
      totalPoints: number;
      totalClicks: number;
      totalRedeemRequest: number;
    };
  };
}

interface AffiliateUser {
  affiliateCode?: string;
}

const AffiliateSettings = () => {
  const dispatch = useDispatch();
  const { affiliateUser } = useSelector(
    (state: AffiliateRootState) => state.affiliateUsers
  );
  const { jwtToken } = useSelector((state: RootState) => state.users);
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );
  const [withdrawalMethod, setWithdrawalMethod] = useState(false);
  const [redeem, setRedeem] = useState(false);

  const [redeemPoints, setRedeemPoints] = useState("");

  const [redeemError, setRedeemError] = useState("");
  const [redeemResponse, setRedeemResponse] = useState({
    amount: 0,
    feeDeduction: 0,
  });
  const [redeemWalletId, setRedeemWalletId] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemInitialData, setRedeemInitialData] = useState({
    deductionFee: 0,
    pointValue: 0,
  });

  const affiliateUsers = async () => {
    try {
      const affiliateUser = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/single/user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return affiliateUser.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getAffiliateUsers() {
    try {
      const response: AffiliateUser = await affiliateUsers();
      dispatch(setAffiliateUser(response));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      jwtToken && getAffiliateUsers();
    }
  }, []);

  const redeemingPoints = async () => {
    const redeemData = {
      points: redeemPoints,
    };
    try {
      setRedeemLoading(true);
      setRedeemResponse({ amount: 0, feeDeduction: 0 });
      setRedeemError("");
      const redeemPoints = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/redeem/initiate`,
        {
          method: "POST",
          body: JSON.stringify(redeemData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return redeemPoints.json();
    } catch (error) {
      console.log(error);
      setRedeemLoading(false);
    }
  };

  async function redeemPointsWithdraw() {
    try {
      const response = await redeemingPoints();
      console.log(response, "redeem method");
      setRedeemResponse(response);
      setRedeemError(response?.error || "");
      setRedeemLoading(false);
      getAffiliateUsers();
    } catch (error) {
      console.error(error);
      setRedeemLoading(false);
    }
  }

  const redeemInitials = async () => {
    try {
      const affiliateUser = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/redeem/initial`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return affiliateUser.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getRedeemInitials() {
    try {
      const response = await redeemInitials();
      setRedeemInitialData(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      jwtToken && getRedeemInitials();
    }
  }, []);

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap mt-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Redeem Rewards</h2>
          <ButtonSecondary
            disabled={redeemLoading === true}
            onClick={() => {
              setRedeem(!redeem);
              setRedeemError("");
              setRedeemResponse({ amount: 0, feeDeduction: 0 });
            }}
          >
            BACK
          </ButtonSecondary>
        </div>

        <div>
          <div className="flex justify-between">
            <div>
              <p>Balance</p>
              <p className="text-4xl"> {affiliateUser?.totalPoints || 0}</p>
            </div>
          </div>

          <input
            className="font-medium listingSection__wrap mt-4 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onChange={(e) => setRedeemPoints(e.target.value)}
            placeholder="Please enter the amount of points you want to withdraw"
          />

          <div className="">
            <select
              className="font-medium listingSection__wrap mt-4 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              id="currency"
              name="selectedId"
              onChange={(e) => setRedeemWalletId(e.target.value)}
            >
              <option className="font-medium" value="">
                transfer to Be Happy wallet
              </option>
            </select>
          </div>

          {redeemPoints !== "" && (
            <>
              <ButtonPrimary
                onClick={redeemPointsWithdraw}
                className="w-full mt-4"
                loading={redeemLoading}
              >
                Submit
              </ButtonPrimary>
              {redeemError !== "" && (
                <p className="text-[13px] mt-3 pl-3 text-red-500">
                  Error: {redeemError}
                </p>
              )}

              {redeemResponse && redeemResponse?.amount > 0 && (
                <>
                  <div className="mt-5">
                    <div className="flex flex-col gap-3 ">
                      <p className="text-[20px] text-green-500">Success </p>
                      <p className="text-[20px] text-green-500">
                        Amount Credited:  {priceConversion(redeemResponse?.amount || 0, selectedCurrency, true)} 
                      </p>
                      <p className="text-[20px] text-black">
                        Fee Deduction:  {priceConversion(redeemResponse?.feeDeduction || 0, selectedCurrency, true)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div className="mt-5">
            <p className="font-semibold">FAQs</p>
            <li>Minimum redeeming points is 50</li>
            <li>
              {redeemInitialData.pointValue || 0} points is equals to{" "}
              {priceConversion(1, selectedCurrency, true)}
            </li>
            <li>
              Deduction Fee is {redeemInitialData.deductionFee || 0} points
            </li>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Settings</h2>
      {withdrawalMethod === false && redeem === false && (
        <>
          <div className="flex flex-col md:flex-row gap-7">
            <div className="space-y-10 border rounded-3xl px-10 py-10">
              <div className="">
                <p className="text-md">My Points</p>
                <p className="text-6xl">{affiliateUser?.totalPoints || 0}</p>
              </div>
              <ButtonPrimary
                className="w-full"
                onClick={() => setRedeem(!redeem)}
              >
                Redeem It
              </ButtonPrimary>
            </div>
          </div>
          <div></div>
        </>
      )}
      {redeem === true && <>{renderSection2()}</>}
    </div>
  );
};

export default AffiliateSettings;
