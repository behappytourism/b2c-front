"use client";

import { RootState } from "@/redux/store";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import priceConversion from "@/utils/priceConversion";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  const { jwtToken } = useSelector((state: RootState) => state.users);
  const [walletBalance, setWalletBalance] = useState({ balance: 0 });
  const [isModal, setIsModal] = useState(false);
  const [isNewBankAccount, setIsNewBankAccount] = useState(true);
  const { selectedCurrency, countries } = useSelector(
    (state: RootState) => state.initials
  );
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [withdrawalResponse, setWithdrawalResponse] = useState("");

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [data, setData] = useState({
    isoCode: "",
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    ibanCode: "",
    amount: 0,
  });

  const getWalletBalance = async () => {
    try {
      const walletBalance = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wallet-balance`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 1 },
        }
      );

      const data = await walletBalance.json();
      setWalletBalance(data || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWalletBalance();
  }, [jwtToken]);

  const withdrawReq = async () => {
    setError("")
    setIsLoading(true)
    setWithdrawalResponse("");
    const payload = {
      isNewBankAccount: isNewBankAccount,
      ...data,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/wallet/withdraw-requests/initiate`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }
  };

  async function getWithdrawReq() {
    try {
      const response = await withdrawReq();
      setIsLoading(false)
      
      if (response?.error) {
        setError(response.error || "");
      }
  
      if (response?.message) {
        setWithdrawalResponse(response.message || "Success");
  
        // Reset data object after successful response
        setData({
          isoCode: "",
          bankName: "",
          branchName: "",
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
          ibanCode: "",
          amount: 0,
        });
      }

    } catch (error) {
      console.error(error);
      setIsLoading(false)
    }
  }

  const transHistory = async () => {
    const payload = {
      isNewBankAccount: isNewBankAccount,
      ...data,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/transactions/all?skip=0&limit=100`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getTransHistory() {
    try {
      const response = await transHistory();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTransHistory();
  }, []);

  return (
    <div className="container my-10">
      <h3 className="text-4xl font-semibold mb-10">Wallet</h3>
      <div className="w-fit space-y-3 border rounded-2xl px-4 py-2">
        <p className="font-semibold">Available Balance</p>
        <div className="w-full flex justify-end">
          <h3 className="text-2xl font-bold">
            {" "}
            {priceConversion(
              walletBalance?.balance || 0,
              selectedCurrency,
              true
            )}
          </h3>
        </div>

      {walletBalance?.balance > 0 && (
        <div>
          <button
            onClick={() => setIsModal(true)}
            className="font-light bg-secondary-500 text-white rounded-3xl text-sm px-4 py-1"
            >
            Withdraw
          </button>
        </div>
          )}
      </div>

      {isModal && (
        <div className="absolute z-30 inset-0 bg-black/30 h-full w-full flex flex-col justify-center">
          <div className="flex justify-center w-full container">
            <div className="bg-white rounded-2xl px-6 py-4 space-y-4 w-full md:max-w-[400px]">
              <div>
                <p>Country</p>
                <select
                  className="block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 h-full rounded-lg outline-none bg-transparent capitalize text-sm text-gray-600 font-medium"
                  name="isoCode"
                  value={data.isoCode}
                  onChange={handleChange}
                  required
                >
                  <option hidden></option>{" "}
                  {countries?.map((item) => (
                    <option
                      className="capitalize bg-white"
                      value={item?.isocode}
                    >
                      {item?.countryName}{" "}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p>Account Number</p>
                <Input
                  name="accountNumber"
                  value={data.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="Account Number"
                />
              </div>

              <div>
                <p>Bank Name</p>
                <Input
                  name="bankName"
                  value={data.bankName}
                  onChange={handleChange}
                  required
                  placeholder="Bank Name"
                />
              </div>

              <div>
                <p>Branch Name</p>
                <Input
                  name="branchName"
                  value={data.branchName}
                  onChange={handleChange}
                  required
                  placeholder="Branch Name"
                />
              </div>

              {data?.isoCode === "IN" ? (
                <div>
                  <p>IFSC code</p>
                  <Input
                    name="ifscCode"
                    value={data.ifscCode}
                    onChange={handleChange}
                    placeholder="IFSC Code"
                  />
                </div>
              ) : (
                <div>
                  <p>Iban code</p>
                  <Input
                    name="ibanCode"
                    value={data.ibanCode}
                    onChange={handleChange}
                    placeholder="Iban Code"
                  />
                </div>
              )}

              <div>
                <p>Account holder name</p>
                <Input
                  name="accountHolderName"
                  value={data.accountHolderName}
                  onChange={handleChange}
                  required
                  placeholder="Account Holder Name"
                />
              </div>

              <div>
                <p>Amount</p>
                <Input
                  name="amount"
                  value={data.amount}
                  onChange={handleChange}
                  required
                  placeholder="Amount"
                />
              </div>

              {error !== "" && (
                <div className="text-red-500">
                  <p>Error: {error || ""}</p>
                </div>
              )}

{withdrawalResponse !== "" && (
                <div className="text-green-500">
                  <p>Success: {withdrawalResponse || ""}</p>
                </div>
              )}

              <div className="flex justify-around">
                <ButtonSecondary
                  onClick={() => getWithdrawReq()}
                  loading={isLoading}
                  className="font-light bg-secondary-500 text-black rounded-3xl text-sm px-4 py-1"
                >
                  Withdraw
                </ButtonSecondary>
                <button
                disabled={isLoading}
                  onClick={() => {setIsModal(false); setIsLoading(false); setWithdrawalResponse(""); setError("")}}
                  className="font-light bg-black text-white rounded-3xl text-sm px-4 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
