"use client"

import React, { useState } from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { useSelector } from "react-redux";

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

const AccountPass = () => {
  const { jwtToken } = useSelector((state: userRootState) => state.users);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const profilePasswordUpdate = async () => {
    const updatePasswordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      const profilePasswordUpdate = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/update/password`,
        {
          method: "PATCH",
          body: JSON.stringify(updatePasswordData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return profilePasswordUpdate.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function updateProfilePassword() {
    try {
      const response = await profilePasswordUpdate();
      setError(response?.error);
      setMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Update your password</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className=" max-w-xl space-y-6">
        <div>
          <Label>Current password</Label>
          <Input
            value={oldPassword}
            onChange={(e) => setOldPassword(e?.target?.value)}
            type="password"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>New password</Label>
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e?.target?.value)}
            type="password"
            className="mt-1.5"
          />
        </div>
        <div className="pt-2">
          {oldPassword !== "" && newPassword !== "" && (
            <ButtonPrimary onClick={updateProfilePassword}>
              Update password
            </ButtonPrimary>
          )}
          {error !== "" && <p className="text-[13px] mt-3">{error}</p>}

          {message !== "" && <p className="text-[13px] mt-3">{message}!</p>}
        </div>
      </div>
    </div>
  );
};

export default AccountPass;
