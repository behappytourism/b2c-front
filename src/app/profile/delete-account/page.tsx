"use client";

import React, { useEffect, useState } from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/features/usersSlice";

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

const AccountDelete = () => {
  const { jwtToken, user } = useSelector((state: userRootState) => state.users);

  const route = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.name) {
      route.push("/");
    }
  }, []);

  const accountDeletion = async () => {
    const deleteData = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    try {
      const accountDeletion = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/delete`,
        {
          method: "DELETE",
          body: JSON.stringify(deleteData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return accountDeletion.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function accountDelete() {
    try {
      const response = await accountDeletion();
      setError(response?.error);
      setMessage(response?.message);
      {
        response?.message && dispatch(logoutUser() as any);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Delete account</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className=" max-w-xl space-y-6">
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            type="email"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
            type="password"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e?.target?.value)}
            type="password"
            className="mt-1.5"
          />
        </div>
        <div className="pt-2">
          {email !== "" && password !== "" && confirmPassword !== "" && (
            <ButtonPrimary onClick={accountDelete}>
              Remove Account
            </ButtonPrimary>
          )}
          {error !== "" && <p className="text-[13px] mt-3">{error}</p>}

          {message !== "" && <p className="text-[13px] mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AccountDelete;
