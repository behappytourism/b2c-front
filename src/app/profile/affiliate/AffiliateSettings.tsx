"use client"

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ButtonSecondary from "@/shared/ButtonSecondary";

export interface AffiliateSettingsPageProps {}

interface AffiliateWallet {
  type: string;
  _id: string;
  address: string;
  accountNumber: string;
  network: string;
}

const AffiliateSettings = () => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const [affiliateWallets, setAffiliateWallets] = useState<AffiliateWallet[]>(
    []
  );
  const [withdrawalMethod, setWithdrawalMethod] = useState(false);
  const [redeem, setRedeem] = useState(false);
  const [addType, setAddType] = useState("");
  const [country, setCountry] = useState("UAE");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletNetwork, setWalletNetwork] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [iban, setIban] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [redeemCurrency, setRedeemCurrency] = useState("");
  const [redeemPoints, setRedeemPoints] = useState("");
  const [redeemWalletId, setRedeemWalletId] = useState("");
  const [cryptoMessage, setCryptoMessage] = useState("");
  const [bankMessage, setBankMessage] = useState("");
  const [redeemMessage, setRedeemMessage] = useState("");



  const FetchAffiliatePaymentMethods = async () => {
    try {
      const FetchAffiliatePaymentMethods = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/financial/list`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return FetchAffiliatePaymentMethods.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getAffiliatePaymentMethods() {
    try {
      const response = await FetchAffiliatePaymentMethods();
      setAffiliateWallets(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      jwtToken && getAffiliatePaymentMethods();
    }
  }, []);

  const addCryptoAffiliatePaymentMethod = async () => {
    const cryptoData = {
      type: "crypto",
      address: walletAddress,
      network: walletNetwork,
    };
    try {
      const addCryptoAffiliatePaymentMethod = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/financial-data/add`,
        {
          method: "POST",
          body: JSON.stringify(cryptoData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return addCryptoAffiliatePaymentMethod.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function addCryptoWallet() {
    try {
      const response = await addCryptoAffiliatePaymentMethod();
      console.log(response, "withdrawal method");
      setCryptoMessage(response?.message)
      getAffiliatePaymentMethods();
    } catch (error) {
      console.error(error);
    }
  }

  const addBankAffiliatePaymentMethod = async () => {
    const bankData = {
      type: "bank",
      bankName: bankName,
      accountHolderName: accountHolderName,
      ifsc: ifsc,
      iban: iban,
      accountNumber: accountNumber,
      countryCode: country,
    };
    try {
      const addBankAffiliatePaymentMethod = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/financial-data/add`,
        {
          method: "POST",
          body: JSON.stringify(bankData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return addBankAffiliatePaymentMethod.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function addBankWallet() {
    try {
      const response = await addBankAffiliatePaymentMethod();
      console.log(response, "withdrawal method");
      setBankMessage(response?.message)
      getAffiliatePaymentMethods();
    } catch (error) {
      console.error(error);
    }
  }

  const redeemingPoints = async () => {
    const redeemData = {
      currency: redeemCurrency,
      points: redeemPoints,
      selectedId: redeemWalletId,
    };
    try {
      const redeemPoints = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/redeem/initiate`,
        {
          method: "POST",
          body: JSON.stringify(redeemData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return redeemPoints.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function redeemPointsWithdraw() {
    try {
      const response = await redeemingPoints();
      setRedeemMessage(response?.error || response?.message)
      console.log(response, "redeem method");
    } catch (error) {
      console.error(error);
    }
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap mt-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Add Withdrawal Method</h2>
          <ButtonSecondary
            onClick={() => setWithdrawalMethod(!withdrawalMethod)}
          >
            BACK
          </ButtonSecondary>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        <div>
          <div className="">
            <select
              id="currency"
              onChange={(e) => setAddType(e.target.value)}
              className="font-bold p-1 listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <option value="">Select your payment type</option>
              {/* <option value="crypto">Crypto Wallet</option> */}
              <option value="bank">Bank Account</option>
            </select>
          </div>
        </div>

        <div>
          {/* {addType === "crypto" && (
            <>
              <div>
                <div className="">
                  <select
                    id="currency"
                    className="font-bold border listingSection__wrap  dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    name="network"
                    value={walletNetwork}
                    onChange={(e) => setWalletNetwork(e.target.value)}
                  >
                    <option value="">Select Network Plan</option>
                    <option value="bep20-bsc">BEP20</option>
                    <option value="eth">ETH</option>
                    <option value="tron">TRC20 (TRON)</option>
                  </select>
                </div>

                <div className="p-1 mt-4">
                  <input
                    value={walletAddress}
                    className="w-full border rounded listingSection__wrap  dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    placeholder="Please enter your wallet address"
                    name="address"
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>
              </div>
            </>
          )} */}

          {addType === "bank" && (
            <>
              <div className="items-center">
                <div className="mb-4">
                  <select
                    id="country"
                    name="countryCode"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="font-bold listingSection__wrap  dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <option value="UAE">United Arab Emirates</option>
                    <option value="IND">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
                <div className="items-center mb-4">
                  <input
                    value={accountNumber}
                    className="border rounded listingSection__wrap  dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    placeholder="Please enter your bank account No."
                    name="accountNumber"
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  {country === "IND" && (
                    <input
                      value={ifsc}
                      className=" border rounded listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      placeholder="Please enter your bank IFSC code"
                      name="ifsc"
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  )}
                  {country === "UAE" && (
                    <input
                      value={iban}
                      className=" border rounded listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      placeholder="Please enter your bank IBAN code"
                      name="iban"
                      onChange={(e) => setIban(e.target.value)}
                    />
                  )}
                  {country === "USA" && (
                    <input
                      value={ifsc}
                      className=" border rounded listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      placeholder="Please enter your bank Routing Number"
                      name="ifsc"
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  )}
                  {country === "UK" && (
                    <input
                      value={iban}
                      className="border rounded listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      placeholder="Please enter your bank IBAN code"
                      name="iban"
                      onChange={(e) => setIban(e.target.value)}
                    />
                  )}
                </div>

                <div className="">
                  <input
                    value={accountHolderName}
                    className="mb-4 border rounded listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    placeholder="Please enter account holder name"
                    name="accountHolderName"
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <input
                    value={bankName}
                    className=" border rounded listingSection__wrap dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    placeholder="Please enter your bank branch"
                    name="bankName"
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          {walletNetwork !== "" &&
            walletAddress !== "" &&
            addType === "crypto" && (
              <>
              <ButtonPrimary
                onClick={addCryptoWallet}
                disabled={walletAddress === "" && walletNetwork === ""}
                className="w-full mt-4"
              >
                Submit
              </ButtonPrimary>
              {cryptoMessage !== "" && (
                <p className="text-[13px] mt-3 pl-3">{cryptoMessage}!</p>
              )}
              </>
            )}

          {bankName !== "" &&
            accountHolderName !== "" &&
            accountNumber !== "" &&
            accountNumber !== "" &&
            country !== "" &&
            addType === "bank" && (
              <>
              <ButtonPrimary onClick={addBankWallet} className="w-full mt-4">
                Submit
              </ButtonPrimary>
                {bankMessage !== "" && (
                  <p className="text-[13px] mt-3 pl-3">{bankMessage}!</p>
                )}
                </>
            )}
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap mt-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Redeem Rewards</h2>
          <ButtonSecondary onClick={() => setRedeem(!redeem)}>
            BACK
          </ButtonSecondary>
        </div>

        <div>
          <div className="flex justify-between">
            <div>
              <p>Balance</p>
              <p className="text-4xl">0000</p>
            </div>

            <div className="text-right">
              <p>Converted Amount</p>
              <p className="text-4xl">0000</p>
            </div>
          </div>

          <div className="">
            <select
              onChange={(e) => setRedeemCurrency(e.target.value)}
              id="currency"
              name="currency"
              className="font-medium listingSection__wrap mt-4 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <option value="">
                Select the currency you want to convert in
              </option>
              <option value="AED">AED</option>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <input
            className="font-medium listingSection__wrap mt-4 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onChange={(e) => setRedeemPoints(e.target.value)}
            placeholder="Please enter the amount of points you want to withdraw"
          />

          <div className="">
            <select
              className="font-medium listingSection__wrap mt-4 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              id="currency"
              name="selectedId"
              onChange={(e) => setRedeemWalletId(e.target.value)}
            >
              <option className="font-medium" value="">
                Select the withdrawal method
              </option>
              {affiliateWallets?.map((ele) => {
                return (
                  <>
                    {ele?.type === "crypto" ? (
                      <option value={ele?._id}>{ele?.address}</option>
                    ) : (
                      <option value={ele?._id}>{ele?.accountNumber}</option>
                    )}
                  </>
                );
              })}
            </select>
          </div>
          {redeemCurrency !== "" &&
            redeemPoints !== "" &&
            redeemWalletId !== "" && (
              <>
              <ButtonPrimary
                onClick={redeemPointsWithdraw}
                className="w-full mt-4"
              >
                Submit
              </ButtonPrimary>
               {redeemMessage !== "" && (
                <p className="text-[13px] mt-3 pl-3">{redeemMessage}</p>
              )}
              </>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Settings</h2>
      {withdrawalMethod === false && redeem === false && (
        <>
          <div className="flex flex-col md:flex-row gap-7">
            <div className="listingSection__wrap">
              <div className=" pb-10 md:border-b">
                <p className="text-md">My Points</p>
                <p className="text-6xl">0000</p>
              </div>
              <ButtonPrimary onClick={() => setRedeem(!redeem)}>
                Redeem It
              </ButtonPrimary>
            </div>
            <div className="listingSection__wrap">
              <div className="pb-10 md:border-b">
                <p className="md:text-4xl text-2xl text-right">Add Withdrawal Method</p>
              </div>
              <ButtonPrimary
                onClick={() => setWithdrawalMethod(!withdrawalMethod)}
              >
                Add
              </ButtonPrimary>
            </div>
          </div>
          <div>
            <p className="md:text-4xl text-2xl text-right mb-3 md:mb-0">Added Withdrawal Methods</p>
            {/* {affiliateWallets
              ?.filter((wallet) => wallet?.type === "crypto")
              ?.map((wallet, index) => (
                <div className="listingSection__wrap mt-2">
                  <div className="md:flex md:justify-between">
                    <div>
                      <p>Wallet Address</p>
                      <p>{wallet?.address}</p>
                    </div>
                    <div className="md:text-right mt-3 md:mt-0">
                      <p>Crypto Network</p>
                      <p>{wallet?.network}</p>
                    </div>
                  </div>
                </div>
              ))} */}

            {affiliateWallets
              ?.filter((wallet: any) => wallet?.type === "bank")
              ?.map((wallet: any, index: number) => (
                <div className="listingSection__wrap mt-2">
                  <div className="md:flex md:justify-between">
                    <div>
                      <p>Account Number</p>
                      <p>{wallet?.accountNumber}</p>
                    </div>
                    <div className="md:text-right mt-3 md:mt-0">
                      <p>IBAN/IFSC Code</p>
                      <p>{wallet?.iban || wallet?.ifsc}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-left flex gap-2">
                      <p>Country:</p>
                      <p>{wallet?.countryCode}</p>
                    </div>
                    <div className="text-right flex gap-2">
                      <p>Bank Branch:</p>
                      <p>{wallet?.bankName}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
      {withdrawalMethod === true && <>{renderSection1()}</>}
      {redeem === true && <>{renderSection2()}</>}
    </div>
  );
};

export default AffiliateSettings;