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
  const slicedBody = strippedBody.slice(0, 150) + "..."; // Slice the plain text

const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
}).format(new Date(createdAt));

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full flex justify-center rounded-t-xl overflow-hidden">
        {/* <GallerySlider
          uniqueID={`ExperiencesCard_${"id"}`}
          ratioClass={ratioClass}
          galleryImgs={images}
         // href={data && (`/${data?.destination?.slug}/${data?.slug}` as Route)}
          galleryClass={size === "default" ? "" : ""}
          className=""
        /> */}

        <Image
          className="max-w-[300px] max-h-[600px]"
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
          size === "default" ? "p-3 space-y-1 " : "p-3 space-y-1 -mt-[30px]"
        } absolute  w-full border rounded-3xl bg-secondary-50 z-30  -mt-[30px]`}
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
              {/* <p className="text-xs font-thin"> */}{" "}
              {/* <StartRating
                  reviewCount={totalReviews}
                  point={Number(averageRating?.toFixed(2))}
                /> */}
              {/* <div className="flex gap-1 items-center text-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.75l2.91 5.898 6.49.943-4.7 4.58 1.11 6.468L12 16.876l-5.81 3.063 1.11-6.468-4.7-4.58 6.49-.943L12 1.75z"
                    clipRule="evenodd"
                  />
                </svg>

                <p>{Number(averageRating?.toFixed(2))}</p>
                <p>({totalReviews})</p>
              </div> */}
              {/* </p> */}
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
            <div className="md:flex hidden gap-5 text-gray-500 text-sm justify-center break-words whitespace-normal">
              <div dangerouslySetInnerHTML={{ __html: slicedBody }} />
            </div>

            <div className="flex items-center text-center gap-1 text-xs pt-3">
              <p className="text-xs">
                <CalendarIcon height={16} width={16} />
              </p>
              <p>{formattedDate}</p>
            </div>

            <div className="flex md:hidden  text-neutral-900 ">
              <p
                className={`font-medium text-[10px] capitalize overflow-hidden`}
              >
                {category?.categoryName}
              </p>
            </div>
          </div>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ExperiencesCard max-w-[400px]  md:block min-h-[500px] group relative m-1 dark:bg-gray-800 ${className}`}
      >
        {renderSliderGallery()}
        <Link className="" href={`/blog/${data?.slug}` as Route}>
          {renderContent()}
        </Link>
      </div>
    </>
  );
};

export default BlogsCard;
