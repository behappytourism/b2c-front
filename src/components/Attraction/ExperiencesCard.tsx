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
import Image from "next/image";

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
  ratioClass = "aspect-w-3 aspect-h-2",
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
          href={data && (`/${data?.destination?.slug}/${data?.slug}` as Route)}
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
              <div className="absolute left-[100px] top-0  md:flex hiddengap-1 items-center font-bold text-white text-sm">
                <Badge
                  name={category?.categoryName}
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
              <div className="absolute left-0 top-0 md:flex hidden gap-1 items-center font-bold text-white text-sm">
                <Badge
                  name={category?.categoryName}
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
        <div className="md:space-y-5 md:mb-1">
          <div className="items-center space-y-1 md:mb-3">
            <div className="flex md:hidden items-center justify-between">
              <p className="text-xs font-bold">
                <Badge
                  name={category?.categoryName}
                  className=" relative capitalize "
                  color="red"
                />
              </p>
              <p className="text-xs font-thin">
                {" "}
                <StartRating
                  reviewCount={totalReviews}
                  point={Number(averageRating?.toFixed(2))}
                />
              </p>
            </div>

            <h2
              className={` font-medium capitalize overflow-hidden text-xl ${
                size === "default" ? "text-base" : "text-base"
              }`}
            >
              <span
                className={` line-clamp-1 md:text-center text-xs md:text-xl md:font-medium font-semibold`}
              >
                {title}
              </span>
            </h2>
            <div className="md:flex hidden gap-5 text-gray-500 justify-center">
              <p className={`font-thin text-sm capitalize overflow-hidden`}>
                {destination?.name}
              </p>
              <StartRating
                reviewCount={totalReviews}
                point={Number(averageRating?.toFixed(2))}
              />
            </div>

            <div className="flex md:hidden  text-neutral-900 ">
              <p
                className={`font-medium text-[10px] capitalize overflow-hidden`}
              >
                {destination?.name}, {category?.categoryName}
              </p>
            </div>
          </div>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="md:flex hidden justify-between items-center">
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

        <div className="flex md:hidden items-center">
          <p className="text-xs font-bold">
            {priceConversion(activity?.lowPrice, selectedCurrency, true)}
          </p>
          <p className="text-xs font-thin">/person</p>
        </div>
      </div>
    );
  };

  const renderMobileContent = () => {
    return (
      <div className="flex">
        <div className="w-4/12 flex flex-col justify-center">
          <GallerySlider
            uniqueID={`ExperiencesCard_${"id"}`}
            ratioClass={ratioClass}
            galleryImgs={images}
            href={
              data && (`/${data?.destination?.slug}/${data?.slug}` as Route)
            }
            galleryClass={size === "default" ? "" : ""}
          />
          {/* <Image className="rounded min-h-[90px] max-h-[90px] max-w-[100px]" alt="attraction image" src={process.env.NEXT_PUBLIC_CDN_URL + images[0]} width={500} height={100} /> */}
        </div>

        <div className="w-8/12">
          <Link href={`/${data?.destination?.slug}/${data?.slug}` as Route}>
            <div
              className={`${
                size === "default" ? "p-3 space-y-1 " : "p-3 space-y-1"
              }`}
            >
              <div className="md:space-y-5 md:mb-1">
                <div className="items-center space-y-1 md:mb-3">
                  <div className="flex md:hidden items-center justify-between">
                    <p className="text-xs font-bold">
                      <Badge
                        name={category?.categoryName}
                        className=" relative capitalize "
                        color="red"
                      />
                    </p>
                    <p className="text-xs font-thin">
                      {" "}
                      <StartRating
                        reviewCount={totalReviews}
                        point={Number(averageRating?.toFixed(2))}
                      />
                    </p>
                  </div>

                  <h2
                    className={` font-medium capitalize  text-xl ${
                      size === "default" ? "text-base" : "text-base"
                    }`}
                  >
                    <span
                      className={` md:text-center text-sm md:text-xl md:font-medium font-bold`}
                    >
                      {title}
                    </span>
                  </h2>
                  <div className="md:flex hidden gap-5 text-gray-500 justify-center">
                    <p
                      className={`font-thin text-sm capitalize overflow-hidden`}
                    >
                      {destination?.name}
                    </p>
                    <StartRating
                      reviewCount={totalReviews}
                      point={Number(averageRating?.toFixed(2))}
                    />
                  </div>

                  <div className="flex md:hidden  text-neutral-900 ">
                    <p
                      className={`font-semibold text-[12px] capitalize overflow-hidden`}
                    >
                      {destination?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
              <div className="md:flex hidden justify-between items-center">
                <div className="text-base font-semibold">
                  <p className="font-thin text-gray-400 text-sm capitalize">
                    Starting from
                  </p>
                  <p className="text-xl font-bold">
                    {priceConversion(
                      activity?.lowPrice,
                      selectedCurrency,
                      true
                    )}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-neutral-400 font-thin">
                    * price varies
                  </p>
                </div>
              </div>

              <div className="flex md:hidden items-center">
                <p className="text-xs font-bold">
                  {priceConversion(activity?.lowPrice, selectedCurrency, true)}
                </p>
                <p className="text-xs font-thin">/person</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ExperiencesCard hidden md:block  border group relative m-1 bg-secondary-50 dark:bg-gray-800 ${className}`}
      >
        {renderSliderGallery()}
        <Link href={`/${data?.destination?.slug}/${data?.slug}` as Route}>
          {renderContent()}
        </Link>
      </div>

      <div
        className={`nc-ExperiencesCard md:hidden block  group relative m-1 bg-secondary-50 dark:bg-gray-800 ${className}`}
      >
        <BtnLikeIcon
          isLiked={isLiked}
          onClick={handleLikeExc}
          className="absolute left-0 top-4"
        />
        {renderMobileContent()}
      </div>
    </>
  );
};

export default ExperiencesCard;
