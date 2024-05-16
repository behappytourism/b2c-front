"use client";

import { Tab } from "@headlessui/react";
import CarCard from "@/components/CarCard";
import CommentListing from "@/components/CommentListing";
import ExperiencesCard from "@/components/Attraction/ExperiencesCard";
import StartRating from "@/components/StartRating";
import StayCard from "@/components/StayCard2";
import {
  DEMO_CAR_LISTINGS,
  DEMO_EXPERIENCES_LISTINGS,
  DEMO_STAY_LISTINGS,
} from "@/data/listings";
import React, { FC, Fragment, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar";
import ButtonSecondary from "@/shared/ButtonSecondary";
import SocialsList from "@/shared/SocialsList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  FaceFrownIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import {
  UserIcon as OutlineUser,
  LockClosedIcon as OutlineLock,
  ShoppingBagIcon as OutlineShopping,
  FaceFrownIcon as OutlineSad,
  CurrencyDollarIcon as OutlineDollar,
  ArrowLeftOnRectangleIcon as OutlineLogout,
} from "@heroicons/react/24/outline";
import AccountPage from "../(account-pages)/account/page";
import AccountPass from "../(account-pages)/account-password/page";
import AccountDelete from "../(account-pages)/account-delete/page";
import { logoutUser } from "@/redux/features/usersSlice";
import { useRouter } from "next/navigation";
import Orders from "./orders/page";
import { signOut } from "next-auth/react";
import Label from "@/components/Label";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ComponentLoader from "@/components/loader/ComponentLoader";
export interface ProfilePageProps {}

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

const ProfilePage: FC<ProfilePageProps> = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux.
  const { user, jwtToken, isLoggedIn } = useSelector(
    (state: userRootState) => state.users
  );
  const { countries } = useSelector((state: RootState) => state.initials);

  // States.
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    country: user?.country || "",
    phoneNumber: user?.phoneNumber?.toString() || "",
  });
  const [paxphoneCode, setPaxPhoneCode] = useState<string>("");
  const [error, setError] = useState("");

  // Handle logout function.
  const handleLogout = () => {
    dispatch(logoutUser() as any);
    typeof window !== "undefined" && localStorage.removeItem("random-string");
    signOut();
  };

  // Handle navigation if not logged In.

  useEffect(() => {
    if (!user?.name) {
      router.push("/");
    }
  }, []);

  // setting initial data.
  useEffect(() => {
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
      country: user?.country || "",
      phoneNumber: user?.phoneNumber?.toString() || "",
    });
  }, []);

  useEffect(() => {
    const filteredCountries = countries?.filter(
      (country) => country?._id === profile?.country
    );

    // Extract phonecode from the filtered countries
    const filteredPaxPhoneCode = filteredCountries[0]?.phonecode;

    // Set the flattened phonecode array to paxphoneCode
    setPaxPhoneCode(filteredPaxPhoneCode || "");
  }, [countries, profile]);

  // Onchange data of inputs.
  const onChangeData = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // profile update handler.
  const profileDetailsUpdate = async () => {
    try {
      const profileDetailsUpdate = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/update`,
        {
          method: "PATCH",
          body: JSON.stringify(profile),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return profileDetailsUpdate.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function updateProfileDetails() {
    try {
      const response = await profileDetailsUpdate();
      setError(response?.error);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`nc-AuthorPage `}>
      <div className="space-y-6 sm:space-y-8">
        {/* HEADING */}
        <h2 className="text-3xl font-semibold">Account infomation</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {!user?.name && (
          <>
            <ComponentLoader />
            <ComponentLoader />
            <ComponentLoader />
          </>
        )}
        {user?.name && (
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              <div className="relative rounded-full overflow-hidden flex">
                <Avatar sizeClass="w-32 h-32" />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <form
              onSubmit={updateProfileDetails}
              className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6"
            >
              <div>
                <Label>Name</Label>
                <Input
                  onChange={onChangeData}
                  className="mt-1.5"
                  defaultValue="Eden Tuan"
                  value={profile?.name || user?.name}
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  onChange={onChangeData}
                  className="mt-1.5"
                  defaultValue="example@email.com"
                  value={profile?.email || user?.email}
                  required
                />
              </div>

              <div>
                <Label>Country</Label>
                <select
                  id="countries"
                  value={profile?.country}
                  onChange={(e) =>
                    setProfile((prevProfile) => ({
                      ...prevProfile,
                      country: e?.target?.value,
                    }))
                  }
                  required
                  className="bg-gray-50 mt-1.5 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected>Choose a country</option>
                  {countries?.map((country, index) => (
                    <option key={index} value={country?._id}>
                      {country?.countryName?.slice(0, 1)?.toUpperCase()}
                      {country?.countryName?.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Phone number</Label>
                <div className="flex items-center border rounded-2xl mt-1.5">
                <p className="border-r pl-2 pr-1 text-sm">
                {paxphoneCode}
            </p>
                <Input
                  onChange={onChangeData}
                  name="phoneNumber"
                   className="no-spinner border-none w-fit bg-transparent"
                  value={profile?.phoneNumber || user?.phoneNumber}
                  />
                  </div>
              </div>

              <div className="pt-2">
                <ButtonPrimary type="submit">Update info</ButtonPrimary>
                {error !== "" && (
                  <p className="text-[13px] mt-3 text-red-600">{error}</p>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
