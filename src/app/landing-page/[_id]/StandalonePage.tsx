"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import ButtonPrimary from "@/shared/ButtonPrimary";

import LikeSaveBtns from "@/components/LikeSaveBtns";
import { handleSetFavourites } from "@/redux/features/attractionSlice";
import { Route } from "next";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import {
  CancellationTypeEnum,
  ExcursionDetails,
  ReviewExcursion,
  SectionsExcursion,
} from "@/data/attraction/types";
import Link from "next/link";
import GallerySlider from "@/components/GallerySlider";

interface ExcursionReviews {
  attractionReviews: ReviewExcursion[];
  limit: number;
  skip: number;
  totalAttractionReviews: number;
}
import StandAloneCard from "./StandAloneCard";

const findAttraction = async (_id: string) => {
  try {
    const attraction = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/standalone/single-details/${_id}`,
      { next: { revalidate: 1 } }
    );
    return attraction.json();
  } catch (error) {
    console.log(error);
  }
};

function StandalonePage() {
  const thisPathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const modal = searchParams?.get("modal");
  const dispatch = useDispatch<AppDispatch>();
  const [isModal, setIsModal] = useState("");
  const [mobileModal, setMobileModal] = useState("");

  let limit = Number(searchParams?.get("limit")) || 2;

  // Extract _id from the pathname
  const pathnameParts = thisPathname.split("/");
  const _id = pathnameParts[pathnameParts.length - 1];

  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );
  const { jwtToken, isLoggedIn } = useSelector(
    (state: RootState) => state.users
  );

  const { favourites } = useSelector((state: RootState) => state.attraction);
  //
  const [skipReview, setSkipReview] = useState<number>(0);
  const [isVideoModal, setIsVideoModal] = useState<boolean>(false);

  //
  const [attractionData, setAttractionData] = useState<ExcursionDetails>();

  const [attractionReviews, setAttractionReviews] =
    useState<ExcursionReviews>();
  const [totalReviews, setTotalReviews] = useState<ReviewExcursion[]>([]);
  const [review, setReview] = useState<{ title: string; note: string }>({
    title: "",
    note: "",
  });
  const [stars, setStars] = useState<number>(5);
  const [ratingSubmitErr, setRatingSubmitErr] = useState<string>("");
  //
  const [date, setDate] = useState<Date | null>(null);
  const [showImages, setShowImages] = useState(false);

  // Fetching the attraction details.
  useEffect(() => {
    const fecthApiResponse = async (_id: string) => {
      try {
        const response = await findAttraction(_id);
        setAttractionData(response);
      } catch (error) {
        console.log(error);
      }
    };
    {
      _id && fecthApiResponse(_id);
    }
  }, [_id]);

  const gridValue = useMemo(() => {
    if (attractionData && attractionData?.attractions) {
      const isEven = attractionData?.attractions.length! % 2;
      if (isEven === 0) {
        if (attractionData?.attractions.length! > 2) {
          return 4;
        } else {
          return 2;
        }
      } else {
        return 3;
      }
    }
    // Return a default value when attractionData or attraction is undefined
    return 0;
  }, [attractionData]);

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  // Handle Like button in excursion.
  const handleFavourites = (data: ExcursionDetails) => {
    dispatch(handleSetFavourites(data));
  };

  // isAttracionExist checkng.
  const isFavAttraction = useMemo(() => {
    if (attractionData && attractionData?._id) {
      const isExist = favourites.find(
        (item) => item._id === attractionData._id
      );
      return !!isExist;
    }
    return false;
  }, [attractionData, favourites]);

  const cancellationTypes = attractionData && attractionData?.cancellationType;
  let cancellationTypeString: string;

  if (cancellationTypes !== undefined) {
    switch (cancellationTypes) {
      case CancellationTypeEnum.freeCancellation:
        cancellationTypeString = "Free Cancellation within 24 hours";
        break;
      case CancellationTypeEnum.cancelWithFee:
        cancellationTypeString = "Cancellation with Fee";
        break;
      case CancellationTypeEnum.nonRefundable:
        cancellationTypeString = "Non Refundable";
        break;
      default:
        cancellationTypeString = "";
        break;
    }
  } else {
    cancellationTypeString = "";
  }

  // console.log(attractionData, "attractionaisfdhgsadiufjjh");

  const renderSection1 = () => {
    return (
      <>
        <div className="listingSection__wrap">
          <div className="md:flex justify-between items-center hidden">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {attractionData?.title}
            </h2>
            <LikeSaveBtns
              attraction={attractionData}
              handleFavourites={handleFavourites}
              isLiked={isFavAttraction}
            />
          </div>

          <div className="items-center md:hidden">
            <div className="flex justify-end">
              <LikeSaveBtns
                attraction={attractionData}
                handleFavourites={handleFavourites}
                isLiked={isFavAttraction}
              />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {attractionData?.title}
            </h2>
          </div>

          <div className="max-w-screen overflow-y-auto">
            <div
              dangerouslySetInnerHTML={{
                __html: attractionData?.description || "",
              }}
              className="text-neutral-6000 text-sm dark:text-neutral-300"
            ></div>
          </div>
        </div>
      </>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="md:text-2xl text-lg font-semibold">
          {attractionData && attractionData?.title} - Attractions
        </h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div
          className={`md:grid md:grid-cols-${gridValue} gap-2 flow-root overflow-hidden rounded-xl`}
        >
          {attractionData &&
            attractionData?.attractions?.map((item: any, index: number) => (
              <div>
                <StandAloneCard data={item} size="small" key={item._id} />
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`container nc-ListingExperiencesDetailPage  `}>
      {/* <div className="mb-5">
				<MobileMainNav />
			</div> */}
      {mobileModal === "mobile" && (
        <div className="fixed w-full h-full z-50 left-0 top-0 backdrop-blur-xl bg-opacity-30 bg-black">
          <div className="flex w-full justify-center">
            <div
              onClick={() => setMobileModal("")}
              className="absolute md:top-[110px] dark:bg-neutral-800 top-[70px] md:right-[260px] right-[20px] bg-white rounded-full cursor-pointer"
            >
              <XMarkIcon height={40} width={40} />
            </div>
            <div className="bg-white md:mt-[80px] dark:bg-neutral-800 mt-[120px] m-5 md:m-0 md:min-w-[400px]  md:max-w-[600px] p-2 text-center  md:max-h-[550px] max-h-[400px]  overflow-x-auto py-5 rounded-xl shadow-2xl">
              {" "}
              <p className="text-lg font-semibold underline pb-2">
                {attractionData?.title}
              </p>
              <div>
                {attractionData &&
                  attractionData?.attractions?.map(
                    (item: any, index: number) => (
                      <div className="cursor-pointer">
                        <Link
                          href={
                            `/${item?.destination[0]?.name}/${item?.slug}` as Route
                          }
                        >
                          <div className="p-2 border rounded-xl items-center flex mb-3 flex-col justify-center text-left">
                            <h1 className="font-semibold md:text-lg">
                              {item?.title}
                            </h1>
                            <button className="p-2 bg-primary-6000 w-full text-white font-semibold rounded-xl">
                              Buy Now
                            </button>
                          </div>
                        </Link>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={
          attractionData && attractionData?.images?.length
            ? attractionData?.images
            : [""]
        }
      />

      <header className="rounded-md sm:rounded-xl">
        <div className="relative  sm:gap-2">
          {attractionData && attractionData?.images?.length && (
            <div
              //onClick={() => setIsVideoModal(!isVideoModal)}
              className=" col-span-4 row-span-4 md:col-span-3 md:row-span-3 relative min-h-[50vh] rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
            >
              <>
                <Image
                  onClick={() => {
                    console.log("on Click wrking on Image tag");
                    console.log(
                      process.env.NEXT_PUBLIC_SERVER_URL +
                        attractionData?.images[0]
                    );

                    setIsVideoModal(!isVideoModal);
                  }}
                  alt="photo 1"
                  fill
                  className="object-cover rounded-md sm:rounded-xl"
                  src={`${
                    process.env.NEXT_PUBLIC_SERVER_URL +
                    attractionData?.images[0]
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </>

              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          )}

          {/* {attractionData && (
                      <div
                          className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
                          onClick={handleOpenModalImageGallery}
                      >
                          <Squares2X2Icon className="h-5 w-5" />
                          <span className="ml-2 text-neutral-800 text-sm font-medium">
                              Show all photos
                          </span>
                      </div>
                  )} */}
        </div>
      </header>

      {/* MAIn */}
      <main className="relative mb-10 z-10 mt-11 flex flex-col lg:flex-row  ">
        <div className="w-full space-y-8 lg:pr-10 ">
          {attractionData && (
            <>
              <nav
                className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                aria-label="Breadcrumb"
              >
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <a
                      href="/"
                      className="inline-flex items-center md:text-sm text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3 me-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                      </svg>
                      Home
                    </a>
                  </li>
                  {/* <li>
										<div className="flex items-center">
											<svg
												className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 6 10"
											>
												<path
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													stroke-width="2"
													d="m1 9 4-4-4-4"
												/>
											</svg>
											<a className="ms-1 md:text-sm text-xs font-medium text-gray-500  md:ms-2 dark:text-gray-400  capitalize">
												landing-page
											</a>
										</div>
									</li> */}
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg
                        className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke-width="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <span className="ms-1 block md:hidden text-xs font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                        {attractionData?.title?.slice(0, 15) + "..."}
                      </span>
                      <span className="ms-1 md:block hidden text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                        {attractionData?.title}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              {renderSection1()}
              {attractionData && attractionData.attractions && (
                <>{renderSection2()}</>
              )}
            </>
          )}

          {!attractionData && (
            <>
              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
              >
                <div className="flex items-center justify-center min-w-[100%] min-h-[400px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                <div
                  role="status"
                  className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
                >
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="flex items-center mt-4">
                    <svg
                      className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                      <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>

                <div
                  role="status"
                  className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
                >
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="flex items-center mt-4">
                    <svg
                      className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                      <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>

                <div
                  role="status"
                  className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
                >
                  <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="flex items-center mt-4">
                    <svg
                      className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                      <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      {/* STICKY FOOTER MOBILE */}
      <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-40">
        <div className="container flex items-center justify-between">
          <p className="font-semibold">
            {attractionData && attractionData?.title}
          </p>

          <ButtonPrimary
            onClick={() => setMobileModal("mobile")}
            sizeClass="px-5 sm:px-7 py-3 !rounded-2xl"
          >
            Buy Now
          </ButtonPrimary>
        </div>
      </div>
      {/* <MobileFooterStickyDate attractionData={attractionData} /> */}
    </div>
  );
}

export default StandalonePage;
