"use client";

import StartRating from "@/components/StartRating";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BaseTypeEnum } from "@/data/attraction/types";
import { ArrowDownIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import priceConversion from "@/utils/priceConversion";
import Toggle from "@/shared/Toggle";
import { usePathname } from "next/navigation";

export interface PrivacyPolicyProps { }

interface PP {
    privacyAndPolicies: string;
}

const privacyPolicy: FC<PrivacyPolicyProps> = () => {
    const renderContent = () => {
        const [pp, setPp] = useState<PP>();

        const privacypolicy = async () => {
            try {
                const terms = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/b2c/privacy-and-policies`,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        },
                    }
                );
                return terms.json();
            } catch (error) {
                console.log(error);
            }
        };

        async function getprivacyPolicy() {
            try {
                const response = await privacypolicy();
                setPp(response);
            } catch (error) {
                console.error(error);
            }
        }

        useEffect(() => {

            getprivacyPolicy();

        }, [])


        return (
            <div className="w-full flex flex-col sm:rounded-2xl space-y-10 px-0 sm:p-6 xl:p-8">
                {pp?.privacyAndPolicies && (
                    <>
                        <h1 className="font-bold text-2xl border-b w-fit pb-1">Privacy and Policies</h1>

                        <div
                            dangerouslySetInnerHTML={{ __html: pp?.privacyAndPolicies || "" }}
                            className="text-neutral-6000 text-sm dark:text-neutral-300"
                        ></div>
                    </>
                )}

                {!pp?.privacyAndPolicies && (
                    <>
                        <div role="status" className="w-full animate-pulse mb-5">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>

                        <div role="status" className="w-full animate-pulse mb-5">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>


                        <div role="status" className="w-full animate-pulse mb-5">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                            <span className="sr-only">Loading...</span>
                        </div>


                    </>
                )}
            </div>
        );
    };

    return (
        <div className={`nc-PayPage`}>
            <main className="container mt-11 mb-24 lg:mb-32">
                <div className="max-w-4xl mx-auto">{renderContent()}</div>
            </main>
        </div>
    );
};

export default privacyPolicy;
