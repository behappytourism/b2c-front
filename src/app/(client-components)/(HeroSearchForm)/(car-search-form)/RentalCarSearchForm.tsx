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
    <form className="w-full relative mt-8 md:rounded-full rounded-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800">
      {/* {renderRadioBtn()} */}
      <div className={`relative md:flex md:flex-row p-4 md:p-0`}>
        <VisaDestination
          placeHolder="Destination"
          desc="Pick up location"
          className="flex-1"
          setVisaDestination={setVisaDestination}
        />
        <div className="self-center hidden md:block border-r border-slate-200 dark:border-slate-700 h-8"></div>
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
        <div className="self-center  border-slate-200 dark:border-slate-700 h-8"></div>
        {/* <RentalCarDatesRangeInput className="flex-1" /> */}
        <div
          onClick={() => handleDispatchNationality(isNationality)}
          className="pr-2 xl:pr-4 pt-4">
          {/* <ButtonSubmit href="/listing-car-detail" /> */}
          <ButtonSubmit href={`/visa/${visaDestination}?nationality=${Nationality}` as Route} />
        </div>
      </div>
    </form>
  );
};

export default RentalCarSearchForm;
