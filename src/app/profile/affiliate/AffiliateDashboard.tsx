"use client";

import React, { FC, useEffect } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAffiliateUser } from "@/redux/features/affiliatesSlice";
import SkeletonLoader from "../orders/SkeletonLoader";

export interface AffiliateDashboardPageProps {}

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

const AffiliateDashboard = () => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  const { affiliateUser } = useSelector(
    (state: AffiliateRootState) => state.affiliateUsers
  );

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

  return (
    <>
    {affiliateUser?.affiliateCode && (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Dashboard</h2>
        <div className="border p-4 rounded-2xl shadow-sm shadow-black/10 md:space-y-10 space-y-4">
          <p className="text-right text-[13px] border-b">
            Affiliate Code: {affiliateUser?.affiliateCode}
          </p>


          <div className="flex md:justify-around justify-between">
            <div>
            <p className="md:text-md text-sm">My Points</p>
            <p className="md:text-6xl text-3xl">{affiliateUser?.totalPoints || 0}</p>
            </div>

          <div>
          <p className="md:text-md text-sm">Total Redeemed</p>
                <p className="md:text-6xl text-3xl">
                  {affiliateUser?.totalRedeemRequest || 0}
                </p>
          </div>

          <div>
                <p className="md:text-md text-sm">Total Clicks</p>
                <p className="md:text-6xl text-3xl">{affiliateUser?.totalClicks || 0}</p>
              </div>

          </div>
         
        </div>
    </div>
    )}

    {!affiliateUser?.affiliateCode && (
      <SkeletonLoader />
    )}
    </>
  );
};

export default AffiliateDashboard;
