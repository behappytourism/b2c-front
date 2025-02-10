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
import { Blogs } from "@/data/general/types";
import { CalendarIcon } from "@heroicons/react/24/solid";

export interface ExperiencesCardProps {
  className?: string;
  ratioClass?: string;
  data?: Blogs;
  size?: "default" | "small";
}

const BlogsCard: FC<ExperiencesCardProps> = ({
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

  const { _id, title, category, body, thumbnail, createdAt } = data as Blogs;

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

  const strippedBody = body.replace(/<[^>]*>/g, ""); // Remove all HTML tags
  const slicedBody = strippedBody.slice(0, 100) + "..."; // Slice the plain text

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  }).format(new Date(createdAt));

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full  flex justify-center rounded-t-3xl overflow-hidden">
        {/* <GallerySlider
          uniqueID={`ExperiencesCard_${"id"}`}
          ratioClass={ratioClass}
          galleryImgs={images}
         // href={data && (`/${data?.destination?.slug}/${data?.slug}` as Route)}
          galleryClass={size === "default" ? "" : ""}
          className=""
        /> */}

        <Image
          className={`min-h-[200px] max-h-[200px] rounded-lg md:rounded-none transform hover:scale-110 transition-transform duration-300`}
          src={process.env.NEXT_PUBLIC_CDN_URL + thumbnail}
          width={1000}
          height={1000}
          alt="blog image"
        />
        <BtnLikeIcon
          isLiked={isLiked}
          onClick={handleLikeExc}
          className="absolute right-3 top-3"
        />

        <div className="absolute left-0 top-0 md:flex hidden gap-1 items-center font-bold text-white text-sm">
          <Badge
            name={category?.categoryName}
            className=" relative capitalize "
            color="red"
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={`${
          size === "default" ? "p-3 space-y-1 " : "p-3 space-y-1"
        }   w-full rounded-3xl bg-secondary-50 relative -mt-10`}
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
            <div className="md:flex  gap-5 text-gray-500 text-sm justify-center break-words whitespace-normal min-h-[80px]">
              <div dangerouslySetInnerHTML={{ __html: slicedBody }} />
            </div>

            <div className="flex items-center text-center gap-1 text-xs pt-3">
              <p className="text-xs">
                <CalendarIcon height={16} width={16} />
              </p>
              <p>{formattedDate}</p>
            </div>

            {/* <div className="flex md:hidden  text-neutral-900 ">
              <p
                className={`font-medium text-[10px] capitalize overflow-hidden`}
              >
                {category?.categoryName}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`group relative block border rounded-3xl ${className}`}
      >
        {renderSliderGallery()}
        <Link className="" href={`/blogs/${data?.slug}` as Route}>
          {renderContent()}
        </Link>
      </div>
    </>
  );
};

export default BlogsCard;
