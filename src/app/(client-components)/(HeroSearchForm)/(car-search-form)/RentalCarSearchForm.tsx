"use client";

import React, { FC, useState } from "react";
import LocationInput from "../LocationInput";
import RentalCarDatesRangeInput from "./RentalCarDatesRangeInput";
import VisaDestination from "./VisaDestination";
import VisaNationality from "./VisaNationality";
import ButtonSubmit from "../ButtonSubmit";
import { setInitialData } from "@/redux/features/visaSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Route } from "next";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";

export interface RentalCarSearchFormProps {
  Nationality?: string;
}

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({ }) => {
  const [dropOffLocationType, setDropOffLocationType] = useState<
    "same" | "different"
  >("different");

  const isDdropOffdifferent = dropOffLocationType === "different";

  const [visaDestination, setVisaDestination] = useState("");
  const [visaNationality, setVisaNationality] = useState("");

  const { Nationality } = useSelector((state: RootState) => state.visa);

  const [isNationality, setIsNationality] = useState("");
  const { visaNavigated } = useSelector((state: RootState) => state.affiliateUsers);


  const dispatch = useDispatch();

  const handleDispatchNationality = (item: string) => {
    dispatch(setInitialData({ Nationality: item }));
  };



  return (
    <form className="w-fit relative mt-8 md:rounded-xl rounded-xl dark:shadow-2xl dark:bg-neutral-800">
      {/* {renderRadioBtn()} */}
      <div className={`relative md:flex md:flex-row p-4 md:p-0 gap-1 -mb-10`}>
        <div className="bg-white rounded-xl shadow-xl dark:shadow-2xl dark:bg-neutral-800 w-[500px]">
        <VisaDestination
          placeHolder="Destination"
          desc="Pick up location"
          className="flex-1"
          setVisaDestination={setVisaDestination}
          />
          </div>
        <div className="self-center hidden md:block border-r border-slate-200 dark:border-slate-700 h-8"></div>
        <div className="bg-white rounded-xl shadow-xl dark:shadow-2xl dark:bg-neutral-800">
        <VisaNationality
          placeHolder="Nationality"
          desc="Pick your nationality"
          className="flex-1"
          visaDestination={visaDestination}
          divHideVerticalLineClass="-inset-x-0.5"
          setVisaNationality={setVisaNationality}
          Nationality={Nationality}
          setIsNationality={setIsNationality}
        />
        </div>
        <div className="self-center  border-slate-200 dark:border-slate-700 h-8"></div>
      </div>
    </form>
  );
};

export default RentalCarSearchForm;
