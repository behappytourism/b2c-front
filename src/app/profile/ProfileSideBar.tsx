"use client";

import { logoutUser } from "@/redux/features/usersSlice";
import Avatar from "@/shared/Avatar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "next-auth/react";
import {
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  FaceFrownIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
  HeartIcon
} from "@heroicons/react/24/solid";
import {
  UserIcon as OutlineUser,
  LockClosedIcon as OutlineLock,
  ShoppingBagIcon as OutlineShopping,
  FaceFrownIcon as OutlineSad,
  CurrencyDollarIcon as OutlineDollar,
  ArrowLeftOnRectangleIcon as OutlineLogout,
  HeartIcon as OutlineHeartIcon,
} from "@heroicons/react/24/outline";
import { Route } from "next";

interface userRootState {
  users: {
    user: {
      name: string;
      email: string;
      phoneNumber: number;
    };
    jwtToken: string;
    isLoggedIn: boolean;
  };
}

enum CategoryAccounts {
  Profile = "",
  UpdatePassword = "update-password",
  DeleteAccount = "delete-account",
  Orders = "orders",
  Logout = "logout",
  favourite = "favourite",
  Affiliate = "affiliate"
}

interface ProfileSideBarProps {
  currentTab?: string;
}

const ProfileSideBar: React.FC<ProfileSideBarProps> = ({ currentTab }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const thisPathname = usePathname();

  const { user, jwtToken, isLoggedIn } = useSelector(
    (state: userRootState) => state.users
  );

  const [accountCategory, setAccountCategory] = useState<CategoryAccounts>(
    CategoryAccounts.Profile
  );

  // Validating the pages and make selection.
  useEffect(() => {
    const isValidCategory = (value: string): value is CategoryAccounts => {
      return [
        "profile",
        "update-password",
        "delete-account",
        "orders",
        "",
        "logout",
        "favourite"
      ].includes(value);
    };

    const categoryName = thisPathname.split("/")[2];

    // Check if the obtained category is a valid member of the union type
    if (isValidCategory(categoryName)) {
      const category: CategoryAccounts = categoryName;
      setAccountCategory(category);
    } else {
      setAccountCategory(CategoryAccounts.Profile);
    }
  }, [thisPathname]);

  // Logout handler.
  const handleLogout = async() => {
    await signOut()
    await localStorage.removeItem("random-string");
    await dispatch(logoutUser() as any);
  };

  // Validating whether user loggedin or not and redirecting to home ifnot.
  useEffect(() => {
    {
      jwtToken === "" && isLoggedIn === false && router.push("/");
    }
  }, [user, jwtToken, isLoggedIn]);

  return (
    <div className="w-full flex flex-col lg:items-center text-center sm:rounded-2xl rounded-xl shadow-2xl space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8">
      {/* <Avatar
        hasChecked
        hasCheckedClass="w-6 h-6 -top-0.5 right-2"
        sizeClass="w-28 h-28"
        userName={user?.name}
      />

      <div className="space-y-3 ext-center flex flex-col lg:items-center items-start">
        <h2 className="text-3xl font-semibold">
          Welcome, {user?.name?.split(" ")[0]}!
        </h2>
      </div> */}

      {/* <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div> */}

      {/* ---- */}
      {/* <div className="space-y-4">
        {!user?.email && (
          <>
            <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
              <div className="flex items-center w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
              </div>
              <div className="flex items-center w-full max-w-[480px]">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
              </div>
            </div>
          </>
        )}
        {user?.email && (
          <div className="flex items-center space-x-4 text-sm">
            <EnvelopeIcon className="h-6 w-6" />
            <span className="text-neutral-6000 dark:text-neutral-300">
              {user?.email}
            </span>
          </div>
        )}
        {user?.phoneNumber && (
          <div className="flex items-center space-x-4">
            <PhoneIcon className="h-6 w-6" />
            <span className="text-neutral-6000 dark:text-neutral-300">
              {user?.phoneNumber}
            </span>
          </div>
        )}
      </div>

      <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div> */}

      <div className="flex justify-between gap-14">
        <div
          onClick={() => router.push("/profile" as Route)}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === CategoryAccounts.Profile ? (
            <UserIcon className="h-6 w-6" />
          ) : (
            <OutlineUser className="h-6 w-6" />
          )}
          <span
            className={`${accountCategory === CategoryAccounts.Profile
              ? "text-primary-6000"
              : "text-neutral-6000"
              } dark:text-neutral-300`}
          >
            Profile
          </span>
        </div>

        <div
          onClick={() => router.push("/profile/update-password" as Route)}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === CategoryAccounts.UpdatePassword ? (
            <LockClosedIcon className="h-6 w-6" />
          ) : (
            <OutlineLock className="h-6 w-6" />
          )}
          <span
            className={`${accountCategory === CategoryAccounts.UpdatePassword
              ? "text-primary-6000"
              : "text-neutral-6000"
              } dark:text-neutral-300`}
          >
            Update Password
          </span>
        </div>

        <div
          onClick={() => router.push("/profile/favourite" as Route)}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === CategoryAccounts.favourite ? (
            <HeartIcon className="h-6 w-6" />
          ) : (
            <OutlineHeartIcon className="h-6 w-6" />
          )}
          <span
            className={`${accountCategory === CategoryAccounts.favourite
              ? "text-primary-6000"
              : "text-neutral-6000"
              } dark:text-neutral-300`}
          >
            Favourite
          </span>
        </div>

        <div
          onClick={() => router.push("/profile/orders" as Route)}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === CategoryAccounts.Orders ? (
            <ShoppingBagIcon className="h-6 w-6" />
          ) : (
            <OutlineShopping className="h-6 w-6" />
          )}
          <span
            className={`${accountCategory === CategoryAccounts.Orders
              ? "text-primary-6000"
              : "text-neutral-6000"
              } dark:text-neutral-300`}
          >
            Orders
          </span>
        </div>

        {/* <div
          onClick={() => router.push("/profile/delete-account" as Route)}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === CategoryAccounts.DeleteAccount ? (
            <FaceFrownIcon className="h-6 w-6" />
          ) : (
            <OutlineSad className="h-6 w-6" />
          )}
          <span
            className={`${accountCategory === CategoryAccounts.DeleteAccount
              ? "text-primary-6000"
              : "text-neutral-6000"
              } dark:text-neutral-300`}
          >
            Delete Account
          </span>
        </div> */}

        {/* <div
          onClick={() => router.push("/profile/affiliate" as Route)}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === "affiliate" ? (
            <CurrencyDollarIcon className="h-6 w-6" />
          ) : (
            <OutlineDollar className="h-6 w-6" />
          )}
          <span
            className={`${accountCategory === "affiliate"
              ? "text-primary-6000"
              : "text-neutral-6000"
              } dark:text-neutral-300`}
          >
            Affiliate
          </span>
        </div> */}

        <div
          onClick={handleLogout}
          className="flex items-center cursor-pointer space-x-4"
        >
          {accountCategory === CategoryAccounts.Logout ? (
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          ) : (
            <OutlineLogout className="h-6 w-6" />
          )}
          <span className="text-neutral-6000 dark:text-neutral-300">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSideBar;
