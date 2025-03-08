"use client"

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

  const { affiliateUser } = useSelector((state: AffiliateRootState) => state.affiliateUsers);

  

  

  const affiliateUsers= async () => {
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
    {jwtToken && (
    getAffiliateUsers()
    )}
  },[])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Dashboard</h2>
      <div className="flex flex-col md:flex-col">
       <div className="listingSection__wrap">
        <p className="text-right text-[13px] border-b">Affiliate Code: {affiliateUser?.affiliateCode}</p>
        <div className="md:flex">
            <div className=" pr-20 mr-4 md:border-r">
                <p className="text-md">My Points</p>
                <p className="text-6xl">0000</p>
            </div>

            <div className="flex justify-between w-full md:mt-0 mt-4">
                <div>
                <p className="text-md">Total Points Earned</p>
                <p className="text-6xl">{affiliateUser?.totalPoints || 0}</p>
                </div>
                <div>
                <p className="text-md">Total Redeemed</p>
                <p className="text-6xl">{affiliateUser?.totalRedeemRequest || 0}</p>
                </div>
                <div>
                <p className="text-md">Total Clicks</p>
                <p className="text-6xl">{affiliateUser?.totalClicks || 0}</p>
                </div>
            </div>
        </div>
       </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;