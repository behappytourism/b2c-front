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

export interface AffiliateDashboardPageProps {}

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

interface AffiliateLink {
  title: string;
  slug: string;
}

const AffiliateLinks = () => {
  const { user, jwtToken } = useSelector((state: RootState) => state.users);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { affiliateUser } = useSelector(
    (state: AffiliateRootState) => state.affiliateUsers
  );

  const filteredAttractionsLinks = affiliateLinks?.filter((attraction) =>
    attraction?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [attractionCopyButtons, setAttractionCopyButtons] = useState(
    Array(affiliateLinks?.length).fill(false)
  );

  const affiliateLink = async () => {
    try {
      const affiliateLink = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/attractions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return affiliateLink.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getAffiliateLinks() {
    try {
      const response = await affiliateLink();
      setAffiliateLinks(response?.attractions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      jwtToken && getAffiliateLinks();
    }
  }, []);

  const [affiliateCode, setAffiliateCode] = useState(0);

  useEffect(() => {
    {affiliateUser && (
      setAffiliateCode(affiliateUser?.affiliateCode)
    )}
  }, [affiliateUser]);

  const handleCopyClick = (
    index: number,
    slug: string,
    affiliateCode: number
  ) => {
    // Get the URL you want to copy
    const linkToCopy = `https://mytravellerschoice.com/details/${slug}?affiliateCode=${affiliateCode}`;
    // const linkToCopy = `http://localhost:3050/details/${slug}?affiliateCode=${affiliateCode}`

    // Create a new input element to temporarily hold the URL
    const input = document.createElement("input");
    input.value = linkToCopy;
    document.body.appendChild(input);

    // Select the URL in the input element
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected URL to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);

    // Update the button state to indicate that the link has been copied
    const updatedButtons = [...attractionCopyButtons];
    updatedButtons[index] = true;
    setAttractionCopyButtons(updatedButtons);
  };

  useEffect(() => {
    const indexOfTrue = attractionCopyButtons.indexOf(true);
    if (indexOfTrue !== -1) {
      const timer = setTimeout(() => {
        const updatedButtons = [...attractionCopyButtons];
        updatedButtons[indexOfTrue] = null;
        setAttractionCopyButtons(updatedButtons);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [attractionCopyButtons]);

  return (
    <div className="space-y-3 sm:space-y-3">
      {/* HEADING */}
      <div>
      <h2 className="text-3xl font-semibold">Affiliate Attractions Link</h2>
      <div>
      <p className="text-[13px]">
        Copy your personalized affiliate link of any of your's favorite
        attractions and get started for fun sharing and earning!
      </p>
      <p className="text-[13px]">
        For every one click and visit to the link will help you get 1 point, so
        share as much as possible... BEST OF LUCK !
      </p>
      </div>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="flex flex-col md:flex-col">
        <div className="pb-4  dark:bg-gray-900">
          <label className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              id="table-search"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for attractions"
            />
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {filteredAttractionsLinks?.length > 0 && (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Attraction name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              {filteredAttractionsLinks.map((attraction, index) => (
                <tbody>
                  <tr className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {attraction?.title}
                    </th>
                    <td className="px-6 py-4">
                      <ButtonPrimary
                        onClick={() =>
                          handleCopyClick(
                            index,
                            attraction?.slug,
                            affiliateUser?.affiliateCode
                          )
                        }
                        className=" min-w-[120px] max-w-[120px]"
                      >
                        {attractionCopyButtons[index] ? "Copied !" : "Copy"}
                      </ButtonPrimary>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          )}

          {filteredAttractionsLinks?.length === 0 && (
            <div
              role="status"
              className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateLinks;
