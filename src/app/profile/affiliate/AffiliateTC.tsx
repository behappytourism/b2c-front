"use client"

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAffiliateUser } from "@/redux/features/affiliatesSlice";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export interface AffiliateTCProps {
  setAffiliateTC: (value: string) => void;
  affiliateTC: string;
  affiliatePolicy: string;
  setModalOpen: (value: boolean) => void;
  modalOpen: boolean;
}

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

const AffiliateTC = ({ setAffiliateTC, affiliateTC, affiliatePolicy, setModalOpen, modalOpen }: AffiliateTCProps) => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setAgree(!agree);
  };

  const { affiliateUser } = useSelector(
    (state: RootState) => state.affiliateUsers
  );


  const affiliateAdd= async () => {
    const addingUser = {
      isTermsAndConditions: agree
    }
    try {
      const affiliateAdd = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(addingUser),
        }
      );
      return affiliateAdd.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function addAffiliateUser() {
    try {
      const response = await affiliateAdd();
      dispatch(setAffiliateUser(response));
      {response && (
        setModalOpen(true)
      )}
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white p-4 text-center items-center rounded fixed top-0 left-0 right-0 bottom-0 z-30  bg-opacity-50 shadow-lg backdrop-blur-md">
      <div className="flex justify-center items-center w-full h-[95vh] z-50">
        <div
          className="min-h-[80vh] p-4 bg-[#fcfeff]  rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        <div
        className="absolute cursor-pointer md:right-20 right-10 top-20  md:top-24 flex justify-center items-center bg-[#ffffff66]  h-16 w-16 rounded-full "
        onClick={() => router.push("/")}
      >
       <XMarkIcon 
       className="h-20 w-20" />
      </div>
          <h2 className="text-3xl font-semibold">Terms and Condition</h2>
          <div className="flex flex-col gap-4  max-w-[800px] container mt-10 max-h-[480px] overflow-x-auto">
            <div className="listingSection__wrap">
            <div dangerouslySetInnerHTML={{ __html: affiliateTC }}></div>
            </div>

            <div className="listingSection__wrap">
            <div dangerouslySetInnerHTML={{ __html: affiliatePolicy }}></div>
            </div>

            <div className="items-center container w-[100%] text-center justify-center">
            <div className="flex justify-center text-center items-center gap-1">
              <input
                type="checkbox"
                checked={isChecked}
                className="rounded-xl h-5 w-5"
                onChange={handleCheckboxChange}
              />

              <p>By checking the box, you agree to our</p>
            </div>
            <div className="flex gap-2 justify-center">
              <p className="text-primary-6000 underline">Terms & Conditions</p>

              <p>and</p>

              <p className="text-primary-6000 underline">Privacy Policy</p>
            </div>
          </div>

          <ButtonPrimary onClick={addAffiliateUser} disabled={!isChecked}>Continue</ButtonPrimary>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AffiliateTC;