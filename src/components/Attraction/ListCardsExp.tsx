"use client"

import React, { FC, useMemo } from "react";
import GallerySlider from "@/components/GallerySlider";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import StartRating from "@/components/StartRating";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import SaleOffBadge from "@/components/SaleOffBadge";
import Badge from "@/shared/Badge";
import Link from "next/link";
import { ExcursionDetails, SearchByDestination } from "@/data/attraction/types";
import { Route } from "next";
import priceConversion from "@/utils/priceConversion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { handleSetFavourites } from "@/redux/features/attractionSlice";
import { useRouter } from "next/navigation";

export interface ListCardsExpHProps {
    className?: string;
    data?: SearchByDestination;
}

const ListCardsExp: FC<ListCardsExpHProps> = ({
    className = "",
    data,
}) => {
    const dispatch = useDispatch()
    const navigate = useRouter();
console.log(data);

    const { selectedCurrency } = useSelector((state: RootState) => state.initials)
    const { favourites } = useSelector((state: RootState) => state.attraction)
    // Check whether the arrtraction is liked or not.
    const isLiked = useMemo(() => {
        const liked = favourites.find((item) => item._id === data?._id)
        if (liked) {
            return true
        } else {
            return false
        }
    }, [favourites])

    // handler for liking the attraction.
    const handleLikeExc = () => {
        if (data) {
            dispatch(handleSetFavourites(data))
        }
    }

    const renderSliderGallery = () => {
        return (
            <div className="flex-shrink-0 p-3 w-full sm:w-64 ">
                <GallerySlider
                    ratioClass="aspect-w-1 h-40 sm:h-56 md:h-40"
                    galleryImgs={data?.images ? data?.images : []}
                    className="w-full h-full rounded-2xl overflow-hidden"
                    uniqueID={`PropertyCardH_${data?._id}`}
                    href={data && `/${data?.destination?.name}/${data?.slug}` as Route}
                />
                {data?.isPromoCode ? <SaleOffBadge desc={"Promotion available"} className="absolute left-5 top-5 !bg-orange-500" /> : ""}
            </div>
        );
    };

    const renderTienIch = () => {
        return (
            <div className="inline-grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline-block">
                        <i className="las la-bed text-lg"></i>
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ">
                        6 beds
                    </span>
                </div>

                {/* ---- */}
                <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline-block">
                        <i className="las la-bath text-lg"></i>
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        3 baths
                    </span>
                </div>

                {/* ---- */}
                <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline-block">
                        <i className="las la-expand-arrows-alt text-lg"></i>
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        1200 Sq. Fit
                    </span>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        return (
            <div className="flex-grow p-3 sm:pr-6 flex flex-col items-start">
                <div className="space-y-4 w-full">
                    <div className="inline-flex space-x-3">
                        <Badge
                            name={
                                data?.destination?.name
                            }
                            className="capitalize"
                        />
                        <Badge
                            name={
                                data?.category?.categoryName}
                            color="yellow"
                            className="capitalize"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        {data?.bookingType && <Badge name={data?.bookingType} className="capitalize" color="green" />}
                        <h2 className="text-lg font-medium capitalize">
                            <span className="line-clamp-2">{data?.title}</span>
                        </h2>
                    </div>
                    {/* {renderTienIch()} */}
                    <div className="w-14 border-b border-neutral-200/80 dark:border-neutral-700 "></div>
                    <div className="flex w-full justify-between items-end">
                        <StartRating reviewCount={data?.totalReviews} point={Number(data?.averageRating?.toFixed(2))} />
                        <span className="flex items-center justify-center px-2.5 py-1.5 border-2 border-secondary-500 rounded-lg leading-none text-sm font-medium text-secondary-500">
                            {priceConversion(data ? data?.activity?.lowPrice : 0, selectedCurrency, true)}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
        onClick={() => navigate.push(`/${data?.destination?.name}/${data?.slug}`)}
            className={`nc-PropertyCardH cursor-pointer group mb-5 relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700 rounded-3xl overflow-hidden ${className}`}
        >
            {/* <Link href={data && `/${data?.destination?.name}/${data?.slug}` as Route} className="absolute inset-0"></Link> */}
            <div className="h-full w-full flex flex-col sm:flex-row sm:items-center">
                {renderSliderGallery()}
                {renderContent()}
            </div>
            <BtnLikeIcon
                colorClass={` bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 hover:bg-opacity-70 text-neutral-6000 dark:text-neutral-400`}
                isLiked={isLiked}
                className="absolute right-5 top-5 sm:right-3 sm:top-3 "
                onClick={handleLikeExc}
            />
        </div>
    );
};

export default ListCardsExp;
