"use client"
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
  ratioClass = "aspect-w-3 aspect-h-3",
}) => {

  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()!;
  const date = searchParams?.get("date");

  const { selectedCurrency } = useSelector((state: RootState) => state.initials)
  const { favourites } = useSelector((state: RootState) => state.attraction)

  const {
    _id, images, isPromoCode, bookingType, destination, title, activity, totalReviews, averageRating, category

  } = data as SearchByDestination;


  const isLiked = useMemo(() => {
    const liked = favourites.find((item) => item._id === _id)
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
      <div className="relative w-full rounded-t-xl overflow-hidden ">
        <GallerySlider
          uniqueID={`ExperiencesCard_${"id"}`}
          ratioClass={ratioClass}
          galleryImgs={images}
          href={data && `/${data?.destination?.name}/${data?.slug}` as Route}
          galleryClass={size === "default" ? undefined : ""}
        />
        <BtnLikeIcon isLiked={isLiked} onClick={handleLikeExc} className="absolute right-3 top-3" />
        {isPromoCode && <SaleOffBadge desc={"Promotion available"} className="absolute capitalize left-3 top-3" />}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "py-4 space-y-3" : "p-3 space-y-1"}>
        <div className="space-y-2">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-2">
            {size === "default" && <MapPinIcon className="w-4 h-4" />}
            <span className="capitalize">{destination.name}</span>
            {category && <Badge name={category.categoryName} className=" relative capitalize " color="blue" />}
          </div>

          <div className="flex items-center space-x-2">
            {bookingType && <Badge name={bookingType} className=" relative capitalize " color="green" />}
            <h2
              className={` font-medium capitalize overflow-hidden ${size === "default" ? "text-base" : "text-base"
                }`}
            >
              <span className={` line-clamp-1 `}>{title}</span>
            </h2>
          </div>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">
            {priceConversion(activity?.lowPrice, selectedCurrency, true)}
            {` `}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                /person
              </span>
            )}
          </span>
          <StartRating reviewCount={totalReviews} point={Number(averageRating?.toFixed(2))} />
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-ExperiencesCard group relative shadow-2xl m-1 rounded-xl ${className}`}>
      {renderSliderGallery()}
      <Link href={`/${data?.destination?.name}/${data?.slug}` as Route}>{renderContent()}</Link>
    </div>
  );
};

export default ExperiencesCard;
