"use client";
import React, { FC, useMemo } from "react";
import GallerySlider from "@/components/GallerySlider";
import StartRating from "@/components/StartRating";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import SaleOffBadge from "@/components/SaleOffBadge";
import Badge from "@/shared/Badge";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { SearchByDestination } from "@/data/attraction/types";
import { Route } from "next";
import { useSearchParams } from "next/navigation";
import priceConversion from "@/utils/priceConversion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleSetFavourites } from "@/redux/features/attractionSlice";

export interface ExperiencesCardProps {
  className?: string;
  ratioClass?: string;
  data?: SearchByDestination;
  size?: "default" | "small";
}

const ExperiencesCard: FC<ExperiencesCardProps> = ({
  size = "default",
  className = "",
  data,
  ratioClass = "aspect-w-6 aspect-h-4",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams()!;
  const date = searchParams?.get("date");

  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );
  const { favourites } = useSelector((state: RootState) => state.attraction);

  const {
    _id,
    images,
    isPromoCode,
    bookingType,
    destination,
    title,
    activity,
    totalReviews,
    averageRating,
    category,
  } = data as SearchByDestination;

  const isLiked = useMemo(() => {
    const liked = favourites.find((item) => item._id === _id);
    if (liked) {
      return true;
    } else {
      return false;
    }
  }, [favourites]);

  // handler for liking the attraction.
  const handleLikeExc = () => {
    if (data) {
      dispatch(handleSetFavourites(data));
    }
  };

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full overflow-hidden">
        <GallerySlider
          uniqueID={`ExperiencesCard_${"id"}`}
          ratioClass={ratioClass}
          galleryImgs={images}
          href={data && (`/${data?.destination?.name}/${data?.slug}` as Route)}
          galleryClass={size === "default" ? "" : ""}
        />
        <BtnLikeIcon
          isLiked={isLiked}
          onClick={handleLikeExc}
          className="absolute right-3 top-3"
        />

        {isPromoCode && (
          <div className="absolute left-0 top-0 flex gap-1 items-center text-white font-bold text-sm">
            <SaleOffBadge
              desc={"Coupon Offer"}
              className="relative capitalize"
            />
          </div>
        )}

        {isPromoCode && (
          <>
            {bookingType && (
              <div className="absolute left-[100px] top-0 flex gap-1 items-center font-bold text-white text-sm">
                <Badge
                  name={bookingType}
                  className=" relative capitalize "
                  color="red"
                />
              </div>
            )}
          </>
        )}

        {!isPromoCode && (
          <>
            {bookingType && (
              <div className="absolute left-0 top-0 flex gap-1 items-center font-bold text-white text-sm">
                <Badge
                  name={bookingType}
                  className=" relative capitalize "
                  color="red"
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={`${size === "default" ? "p-3 space-y-1 " : "p-3 space-y-1"}`}
      >
        <div className="space-y-5 mb-1">
          <div className="items-center space-y-1 mb-3">
            <h2
              className={` font-medium capitalize overflow-hidden text-xl ${
                size === "default" ? "text-base" : "text-base"
              }`}
            >
              <span className={` line-clamp-1 text-center`}>{title}</span>
            </h2>
            <div className="flex gap-5 text-gray-500 justify-center">
              <p className={`font-thin text-sm capitalize overflow-hidden`}>
                {destination.name}, {category.categoryName}
              </p>
              <StartRating
                reviewCount={totalReviews}
                point={Number(averageRating?.toFixed(2))}
              />
            </div>
          </div>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <div className="text-base font-semibold">
            <p className="font-thin text-gray-400 text-sm capitalize">
              Starting from
            </p>
            <p className="text-xl font-bold">
              {priceConversion(activity?.lowPrice, selectedCurrency, true)}
            </p>

            <p className="text-xs text-gray-400 dark:text-neutral-400 font-thin">
              * price varies
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-ExperiencesCard border group relative m-1 bg-secondary-50 dark:bg-gray-800 ${className}`}
    >
      {renderSliderGallery()}
      <Link href={`/${data?.destination?.name}/${data?.slug}` as Route}>
        {renderContent()}
      </Link>
    </div>
  );
};

export default ExperiencesCard;
