"use client";
import React, { FC, useMemo } from "react";
import GallerySlider from "@/components/GallerySlider";
import BtnLikeIcon from "@/components/BtnLikeIcon";
import SaleOffBadge from "@/components/SaleOffBadge";
import Badge from "@/shared/Badge";
import Link from "next/link";
import { Route } from "next";
import { useSearchParams } from "next/navigation";
import priceConversion from "@/utils/priceConversion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleSetFavourites } from "@/redux/features/attractionSlice";
import Image from "next/image";
import { StandAlone } from "@/data/general/types";
import { CalendarIcon } from "@heroicons/react/24/solid";

export interface ExperiencesCardProps {
  className?: string;
  ratioClass?: string;
  data?: StandAlone;
  size?: "default" | "small";
}

const StandAloneCard: FC<ExperiencesCardProps> = ({
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

  const { _id, title, slug, description, images, shortDesc } =
    data as StandAlone;

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

  const strippedBody = shortDesc?.replace(/<[^>]*>/g, ""); // Remove all HTML tags
  const slicedBody = strippedBody?.slice(0, 150) + "..."; // Slice the plain text

  return (
    <>
      <Link
        href={`/landing-page/${slug}` as Route}
        className={`nc-CardCategory3 flex flex-col ${className}`}
      >
        <div
          className={`flex-shrink-0 relative w-full aspect-w-5  aspect-h-5 sm:aspect-h-6 h-0 rounded-2xl overflow-hidden group`}
        >
          <Image
            //   src={images ? `${process.env.NEXT_PUBLIC_CDN_URL + images[0]}` : ""}
            src={`${process.env.NEXT_PUBLIC_CDN_URL}${images[0] || ""}`}
            className="object-cover w-full h-full rounded-2xl min-w-[600px]"
            alt="packages thumbnail"
            height={1000}
            width={1000}
          />
          <span className="opacity-0 group-hover:opacity-100 absolute right-10 inset-0 bg-black bg-opacity-40 transition-all duration-300 group-hover:transition-all group-hover:duration-300"></span>
          {/* <span className=" bg-gradient-to-b  dark:from-[#1f2836] from-transparent  via-gray-800  to-black md:max-h-[80px] max-h-[90px] top-[80%] absolute md:top-[80%]"></span> */}
        </div>
        <div className="mt-4 max-h-[200px] flex flex-col  md:gap-32 w-full absolute top-10 text-right items-end">
          <div className="flex flex-col gap-4">
            <h2
              className={`text-3xl text-white dark:text-neutral-100 break-words pr-10 md:pr-12 whitespace-normal text-right font-extrabold capitalize`}
            >
              {title}
            </h2>
            <div className=" text-white text-xs md:text-sm px-10 md:text-right break-words whitespace-normal">
              <div dangerouslySetInnerHTML={{ __html: slicedBody }} />
            </div>
          </div>

          <div className="pr-12 md:block absolute md:top-56 top-40">
            <button className="bg-yellow-300 font-semibold text-black rounded-3xl py-3 px-4">
              View More &rarr;
            </button>
          </div>
          <span
            className={`block mt-1.5 text-sm text-neutral-6000 dark:text-neutral-400`}
          >
            {/* {convertNumbThousand(count || 0)} properties */}
          </span>
        </div>
      </Link>
    </>
  );
};

export default StandAloneCard;
