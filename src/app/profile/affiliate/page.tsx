"use client";

import React, { FC, useEffect, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AffiliateDashboard from "./AffiliateDashboard";
import AffiliateLinks from "./AffiliateLinks";
import AffiliateSettings from "./AffiliateSettings";
import AffiliateTransactions from "./AffiliateTransactions";
import AffiliateTC from "./AffiliateTC";
import ProfileSideBar from "../ProfileSideBar";
import { useRouter } from "next/navigation";
export interface AffiliatePageProps {}

const Affiliate = () => {
  const router = useRouter();
  const { jwtToken, user } = useSelector((state: RootState) => state.users);
  const [ordersCategory, setOrdersCategory] = useState("dashboard");
  const [affiliatePolicy, setAffiliatePolicy] = useState("");
  const [affiliateTC, setAffiliateTC] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { affiliateUser } = useSelector(
    (state: RootState) => state.affiliateUsers
  );

  useEffect(() => {
    {
      affiliateUser && setModalOpen(false);
    }
  }, [affiliateUser]);

  console.log(affiliateUser, "user");
  

  useEffect(() => {
    if (!jwtToken) {
      router.push("/");
    }
  }, []);

  const affiliateTCs = async () => {
    try {
      const affiliateTC = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/terms-and-policy`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return affiliateTC.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getAffiliateTC() {
    try {
      const response = await affiliateTCs();
      setAffiliatePolicy(response?.policy);
      setAffiliateTC(response?.termsAndConditions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAffiliateTC();
  }, []);

  return (
    <div className={`nc-AuthorPage `}>
      <div className="w-full  space-y-8 lg:space-y-10 flex-shrink-0">
        <h2 className="text-3xl font-semibold">Affiliation</h2>
        <div className="flex flex-col md:flex-row">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li
                onClick={() => setOrdersCategory("dashboard")}
                className="mr-2 cursor-pointer"
              >
                <a
                  className={`${
                    ordersCategory === "dashboard"
                      ? "text-primary-6000"
                      : "text-neutral-3000"
                  } ${
                    ordersCategory === "dashboard"
                      ? "border-primary-6000"
                      : "border-neutral-3000"
                  } inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                >
                  Dashboard
                </a>
              </li>
              <li
                onClick={() => setOrdersCategory("links")}
                className="mr-2 cursor-pointer"
              >
                <a
                  className={`${
                    ordersCategory === "links"
                      ? "text-primary-6000"
                      : "text-neutral-3000"
                  } ${
                    ordersCategory === "links"
                      ? "border-primary-6000"
                      : "border-neutral-3000"
                  } inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                >
                  Attractions link
                </a>
              </li>
              <li
                onClick={() => setOrdersCategory("settings")}
                className="mr-2 cursor-pointer"
              >
                <a
                  className={`${
                    ordersCategory === "settings"
                      ? "text-primary-6000"
                      : "text-neutral-3000"
                  } ${
                    ordersCategory === "settings"
                      ? "border-primary-6000"
                      : "border-neutral-3000"
                  } inline-block p-4  border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                >
                  Settings
                </a>
              </li>
              <li
                onClick={() => setOrdersCategory("transactions")}
                className="cursor-pointer"
              >
                <a
                  className={`${
                    ordersCategory === "transactions"
                      ? "text-primary-6000"
                      : "text-neutral-3000"
                  } ${
                    ordersCategory === "transactions"
                      ? "border-primary-6000"
                      : "border-neutral-3000"
                  } inline-block p-4  border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                >
                  Transactions
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          {ordersCategory === "dashboard" && <AffiliateDashboard />}
          {ordersCategory === "links" && <AffiliateLinks />}
          {ordersCategory === "settings" && <AffiliateSettings />}
          {ordersCategory === "transactions" && <AffiliateTransactions />}
          {modalOpen === true && (
            <AffiliateTC
              affiliatePolicy={affiliatePolicy}
              setAffiliateTC={setAffiliateTC}
              affiliateTC={affiliateTC}
              setModalOpen={setModalOpen}
              modalOpen={modalOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Affiliate;