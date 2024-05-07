"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import StartRating from "@/components/StartRating";
import Image, { StaticImageData } from "next/image";
import StayDatesRangeInput from "./StayDatesRangeInput";
import { Route } from "next";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import {
  ActivityExcursion,
  CancellationTypeEnum,
  ExcursionDetails,
  ReviewExcursion,
  SectionsExcursion,
  TimeSlotExcursion,
} from "@/data/attraction/types";
import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import priceConversion from "@/utils/priceConversion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { format, parse } from "date-fns";
import GoogleMapReact from "google-map-react";
import DefaultLoader from "@/components/loader/DefaultLoader";
import ReactPlayer from "react-player";
import { ArrowLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import MobileFooterStickyDate from "../../MobileFooterStickyDate";
import {
  handleAddtocart,
  handleChangeActivityData,
  handleDateChange,
  handleSetFavourites,
  storeAttractionActivity,
} from "@/redux/features/attractionSlice";
import placeholder from "@/images/placeholder-large-h.png";
import Textarea from "@/shared/Textarea";
import ErrorModal from "@/shared/Status/ErrorModal";
import Checkbox from "@/shared/Checkbox";
import SlideCalender from "@/shared/Calender/SlideCalender";
import TransferInput from "./activity/TransferInput";
import ActivityListCard from "./activity/ActivityListCard";
import Head from "next/head";

export interface AttractionDetailPageProps {
	attraction: string;
}

const findAttraction = async (attractionSlug: string) => {
  try {
    const attraction = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/single/${attractionSlug}?affiliateCode=`,
      { next: { revalidate: 1 } }
    );
    return attraction.json();
  } catch (error) {
    console.log(error);
  }
};

const findAttractionReviews = async ({
  limit = 5,
  skip = 0,
  attraction,
}: {
  limit: number;
  skip: number;
  attraction: string;
}) => {
  try {
    const reviews = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/reviews/single/${attraction}?limit=${limit}&skip=${skip}`
    );
    return reviews.json();
  } catch (error) {
    console.log(error);
  }
};

interface ExcursionReviews {
  attractionReviews: ReviewExcursion[];
  limit: number;
  skip: number;
  totalAttractionReviews: number;
}

const AttractionDetails: FC<AttractionDetailPageProps> = ({ attraction }) => {
  const thisPathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const modal = searchParams?.get("modal");
  const dispatch = useDispatch<AppDispatch>();
  let limit = Number(searchParams?.get("limit")) || 2;

  const { selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );
  const { jwtToken, isLoggedIn } = useSelector(
    (state: RootState) => state.users
  );

  const { favourites } = useSelector((state: RootState) => state.attraction);
//   const { attraction } = params;
  //
  const [skipReview, setSkipReview] = useState<number>(0);
  const [isVideoModal, setIsVideoModal] = useState<boolean>(false);
  const [addToCart, setAddToCart] = useState<boolean>(false);
  const [checkout, setCheckout] = useState<boolean>(false);
  const [ATCIndex, setATCIndex] = useState<number>(0);

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
  const { activities } = useSelector((state: RootState) => state.attraction);

  const [activitySelected, setActivitySelected] = useState(
    Array(attractionData?.activities?.length).fill(false)
  );

  const toggleActivitySelection = (index: number) => {
    const updatedActivitySelected = [...activitySelected];
    updatedActivitySelected[index] = !updatedActivitySelected[index];
    setActivitySelected(updatedActivitySelected);
  };

  const handleChangeData = (keyName: string, value: any, index: number) => {
    dispatch(
      handleChangeActivityData({
        index: index,
        keyName: keyName,
        value: value,
      })
    );
  };

  // Fetching the attraction details.
  useEffect(() => {
    const fecthApiResponse = async (attraction: string) => {
      try {
        const response = await findAttraction(attraction);
        setAttractionData(response);
        dispatch(
          storeAttractionActivity({
            activity: response.activities,
            attraction: response,
            initialDate: initialDate,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fecthApiResponse(attraction);
  }, [attraction]);

  // Fetching the reviews of attraction.
  const fetchReviewResponse = async ({
    limit = 5,
    skip = 0,
    attraction,
  }: {
    limit: number;
    skip: number;
    attraction: string;
  }) => {
    try {
      // if(totalReviews?.length <=)
      const response = await findAttractionReviews({ limit, skip, attraction });
      setAttractionReviews(response);
      setTotalReviews([...totalReviews, ...response?.attractionReviews]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchReviewResponse({ limit, skip: skipReview, attraction });
  }, [limit, skipReview]);

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  // Onclick handler for reviews.
  const reviewOnClickHandler = () => {
    setSkipReview((prev) => {
      return prev + 1;
    });
  };

  // Finding the review see more button is disabled or not.
  const isReviewSeeMoreDisabled = () => {
    if (attractionReviews?.totalAttractionReviews) {
      return attractionReviews?.totalAttractionReviews <= totalReviews?.length;
    } else {
      return false;
    }
  };

  // Handle Like button in excursion.
  const handleFavourites = (data: ExcursionDetails) => {
    dispatch(handleSetFavourites(data));
  };

  // isAttracionExist checkng.
  const isFavAttraction = useMemo(() => {
    const isExist = favourites.find((item) => item._id === attractionData?._id);
    if (isExist) {
      return true;
    } else {
      return false;
    }
  }, [attractionData?._id, favourites]);

  // Review submit handler.
  const reviewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let headers = {};
      if (jwtToken?.length && jwtToken !== null && jwtToken !== undefined) {
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        };
      } else {
        headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/reviews/add`,
        {
          method: "POST",
          body: JSON.stringify({
            rating: stars,
            title: review?.title,
            description: review?.note,
            attraction: attraction,
          }),
          headers: headers,
        }
      );

      if (!response.ok) {
        const res = await response.json();
        console.log(res);
        setRatingSubmitErr(res?.error);
        return;
      }
      setTotalReviews([]);
      fetchReviewResponse({ limit, skip: 0, attraction: attraction });
    } catch (error: any) {
      setRatingSubmitErr(error?.response?.data?.error);
      console.log(error);
    }
  };

  const closeModal = () => {
    setRatingSubmitErr("");
  };

  // Making breadcrums data.
  const parts = thisPathname?.split("/").filter((part) => part !== "");
  let link = "";
  const breadcrum: BreadcrumbsList[] = parts.map((item) => {
    link += `/${item}`;
    return {
      name: item,
      link: link,
      classNames: "",
    };
  });

  const cancellationTypes = attractionData?.cancellationType;
  let cancellationTypeString: string;
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

  const renderSection1 = () => {
    return (
      <div className="py-5 !space-y-5">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge
              color="green"
              name={attractionData?.bookingType}
              className="capitalize"
            />
            <Badge
              color="blue"
              name={attractionData?.category?.categoryName}
              className="capitalize"
            />
          </div>
          <LikeSaveBtns
            attraction={attractionData}
            handleFavourites={handleFavourites}
            isLiked={isFavAttraction}
          />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {attractionData?.title}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <StartRating
            point={
              attractionData?.averageRating
                ? Number(attractionData?.averageRating?.toFixed(2))
                : 0
            }
            reviewCount={attractionData?.totalRating}
          />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1 capitalize">
              {" "}
              {attractionData?.destination?.name}
            </span>
          </span>
        </div>

        {/* 4 */}

        {/* 5 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-clock text-2xl"></i>
            <span className="">
              {attractionData?.duration +
                " " +
                attractionData?.durationType +
                " (approx)"}{" "}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-coins text-2xl"></i>
            <span className="">{cancellationTypeString}</span>
          </div>
          {attractionData?.bookingType == "ticket" && (
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
              <i className="las la-bolt text-2xl"></i>
              <span className="">Instant Confirmation</span>
            </div>
          )}
        </div>

        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />
      </div>
    );
  };

  // Fetching initial Date from query
  const initialDate = new Date();

  const handleDateOnclick = (date: Date | string) => {
    if (new Date(date) < new Date()) {
      return;
    }
    dispatch(handleDateChange(date));
  };

  const findSlotsAvailable = async ({
    activity,
    jwtToken,
  }: {
    activity: ActivityExcursion;
    jwtToken: string;
  }) => {
    try {
      const slots = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/timeslot`,
        {
          method: "POST",
          body: JSON.stringify({
            productId: activity?.productId,
            productCode: activity?.productCode,
            timeSlotDate: activity?.date,
            activityId: activity?._id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const res: TimeSlotExcursion[] = await slots.json();

      return res;
    } catch (error) {
      console.log(error);
    }
  };
  
  const renderActivitySection = () => {
    return (
      <div className="border-b pb-5">
        <h2 className="text-2xl md:text-3xl w-fit pb-3 font-semibold">
          Select Tour Options
        </h2>
        {typeof attractionData?.highlights === "string" &&
          attractionData?.highlights.length > 50 && (
            <div
              dangerouslySetInnerHTML={{ __html: attractionData?.highlights }}
              className="text-neutral-6000 text-sm mb-10 dark:text-neutral-300"
            ></div>
          )}

        {activities?.map((activity, index) => {
          return (
            <ActivityListCard
              key={activity?._id}
              attraction={attractionData}
              data={activity}
              index={index}
              setAddToCart={setAddToCart}
              addToCart={addToCart}
              setCheckout={setCheckout}
              checkout={checkout}
              setATCIndex={setATCIndex}
              findSlotsAvailable={findSlotsAvailable}
            />
          );
        })}
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold md:text-3xl w-fit mb-3">
          Highlights
        </h2>
        {attractionData?.highlights && (
          <div
            dangerouslySetInnerHTML={{ __html: attractionData?.highlights }}
            className="text-neutral-6000 px-1 dark:text-neutral-300"
          ></div>
        )}
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="pb-10 border-b">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold md:text-3xl w-fit pb-3">
            Availability
          </h2>
          <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
            Included in the Time
          </span>
        </div>
        {/* 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {attractionData?.availability?.map((item) => (
            <div key={item._id} className="flex items-center space-x-3">
              <i className="las la-check-circle text-2xl"></i>
              <span className="capitalize">
                {item?.open && item.close
                  ? `${item.day} ${format(
                      parse(item.open, "HH:mm", new Date()),
                      "h:mm a"
                    )} - ${format(
                      parse(item.close, "HH:mm", new Date()),
                      "h a"
                    )} `
                  : item?.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSection5 = (section: SectionsExcursion) => {
    return (
      <div key={section._id} className="pb-8 border-b">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold md:text-3xl w-fit pb-3 mb-5">
          {section.title}
        </h2>

        {/* desc */}
        {section.body && (
          <span
            dangerouslySetInnerHTML={{ __html: section.body }}
            className="block text-neutral-6000 dark:text-neutral-300"
          ></span>
        )}
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="pb-5 border-b">
        <ErrorModal
          title="Something went wrong"
          text={ratingSubmitErr}
          isOpen={ratingSubmitErr?.length > 0}
          closeModal={closeModal}
        />
        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl w-fit pb-3 font-semibold mb-3">
          Reviews ({attractionReviews?.totalAttractionReviews} reviews)
        </h2>

        {/* Content */}
        {isLoggedIn ? (
          <form onSubmit={reviewSubmitHandler}>
            <div className="space-y-5">
              <FiveStartIconForRate
                setStars={setStars}
                iconClass="w-6 h-6"
                className="space-x-0.5"
              />
              <Input
                fontClass=""
                sizeClass="h-16 px-4 py-3"
                rounded="rounded-lg"
                placeholder="Title of feedback"
                onChange={(e) => {
                  setReview((prev) => {
                    return { ...prev, title: e.target.value };
                  });
                }}
              />
              <Textarea
                onChange={(e) => {
                  setReview((prev) => {
                    return { ...prev, note: e.target.value };
                  });
                }}
                placeholder="Share your thoughts ..."
              />
              <div className="flex justify-end">
                <ButtonPrimary className="rounded-lg" type="submit">
                  Add Review <ArrowRightIcon className="w-5 h-5" />
                </ButtonPrimary>
              </div>
            </div>
          </form>
        ) : (
          ""
        )}

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {totalReviews &&
            totalReviews?.map((review) => (
              <CommentListing data={review} className="py-8" />
            ))}

          <div className="pt-8">
            <ButtonSecondary
              disabled={isReviewSeeMoreDisabled()}
              className=" cursor-pointer disabled:cursor-not-allowed "
              onClick={() => reviewOnClickHandler()}
            >
              View more reviews
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  const Mark = ({ lat, lng }: { lat: number; lng: number }) => (
    <div className="text-2xl text-red-500">
      <i className="las la-map-marker"></i>
    </div>
  );

  // Map section
  const renderSection7 = (latitude: number, longitude: number) => {
    return (
      <div className="">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl md:text-3xl w-fit pb-3 font-semibold mb-5">
            Location
          </h2>
        </div>

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <div className=" overflow-hidden w-full h-full ">
              {latitude &&
              longitude &&
              !isNaN(longitude) &&
              !isNaN(latitude) ? (
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyA6qMfsMovR4sRbC8bu6zMNMH3brgzxwW4",
                  }}
                  defaultCenter={{
                    lat: latitude && Number(latitude),
                    lng: longitude && Number(longitude),
                  }}
                  defaultZoom={14}
                >
                  <Mark
                    lat={latitude && Number(latitude)}
                    lng={longitude && Number(longitude)}
                  />
                </GoogleMapReact>
              ) : (
                <Image
                  src={placeholder}
                  className="w-full h-full object-cover"
                  alt="bann"
                  fill
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="p-5 border-b">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold mb-5">Faq</h2>

        {attractionData?.faqs &&
          attractionData?.faqs?.map((faq) => (
            <div key={faq._id} className="border p-3 rounded-lg mb-3">
              <h4 className="text-lg font-semibold">{faq.question}</h4>
              <span className="block mt-1 text-neutral-500 dark:text-neutral-400">
                {faq.answer}
              </span>
            </div>
          ))}
      </div>
    );
  };

  const selectedActivities = useMemo(() => {
    return activities;
  }, [activities]);

  // console.log(selectedActivities, "selected activites");

  const [errorModalContent, setErrorModalContent] = useState("");
  3;
  const handleCloseErrorModal = () => {
    setErrorModalContent("");
  };

  // const handleAddToCart = (index: number) => {
  //   try {
  //     setErrorModalContent("");
  //     for (let i = 0; i < selectedActivities?.length; i++) {
  //       if (selectedActivities[i]?.slotsAvailable?.length) {
  //         if (!selectedActivities[i].hasOwnProperty("slot")) {
  //           throw new Error("Select the slot for the next step");
  //         } else if (!selectedActivities[i]?.slot.hasOwnProperty("EventID")) {
  //           throw new Error("Select the slot for the next step");
  //         }
  //       }
  //     }
  //     dispatch(handleAddtocart(selectedActivities));
  //     // router.push(`${thisPathname}/activity/checkout` as Route);
  //   } catch (error) {
  //     setErrorModalContent(`${error}`);
  //   }
  // };

  const handleAddToCart = (index: number) => {
    try {
      setErrorModalContent("");
      const selectedActivityAtIndex = selectedActivities[index];
  
      if (selectedActivityAtIndex?.slotsAvailable?.length) {
        if (
          !selectedActivityAtIndex.hasOwnProperty("slot") ||
          !selectedActivityAtIndex.slot.hasOwnProperty("EventID")
        ) {
          throw new Error("Select the slot for the next step");
        }
      }
  
      const updatedSelectedActivity = {
        ...selectedActivityAtIndex,
        destination: attractionData?.destination?.name,
        slug: attractionData?.slug
      };
  
      dispatch(handleAddtocart([updatedSelectedActivity]));
    } catch (error) {
      setErrorModalContent(`${error}`);
    }
  };

  const handleCheckout = (index: number) => {
    try {
      setErrorModalContent("");
      const selectedActivityAtIndex = selectedActivities[index];
  
      if (selectedActivityAtIndex?.slotsAvailable?.length) {
        if (
          !selectedActivityAtIndex.hasOwnProperty("slot") ||
          !selectedActivityAtIndex.slot.hasOwnProperty("EventID")
        ) {
          throw new Error("Select the slot for the next step");
        }
      }
  
      const updatedSelectedActivity = {
        ...selectedActivityAtIndex,
        destination: attractionData?.destination?.name,
        slug: attractionData?.slug
      };
  
      dispatch(handleAddtocart([updatedSelectedActivity]));
    } catch (error) {
      setErrorModalContent(`${error}`);
    }
  };

  useEffect(() => {
    {
      addToCart === true && handleAddToCart(ATCIndex);
    }

    {
      addToCart === true && setAddToCart(false);
    }
  }, [addToCart]);

  useEffect(() => {
    {
      checkout === true && handleCheckout(ATCIndex);
    }

    {
      checkout === true && setCheckout(false);
    }
  }, [checkout]);

  const GrandTotal: number = useMemo(() => {
    let val: number = selectedActivities.reduce((acc, item) => {
      return acc + item.grandTotal;
    }, 0);
    return val;
  }, [activities]);

  const renderSidebar = () => {
    return (
      <div className="p-5 border rounded-xl">
        {/* PRICE */}
        <div className="flex justify-between mb-5 border-b pb-5">
          {GrandTotal === 0 && (
            <div className="text-2xl font-semibold">
              <p className="text-xs font-light text-neutral-700 dark:text-neutral-400">
                Starting from
              </p>
              {attractionData?.activities?.length &&
                priceConversion(
                  attractionData?.activities[0]?.lowPrice,
                  selectedCurrency,
                  true
                )}
              <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
                /
                {attractionData?.activities?.length &&
                  attractionData?.activities[0]?.base}
              </span>
            </div>
          )}

          {GrandTotal > 0 && (
            <div className="text-2xl font-semibold">
              <p className="text-xs font-light text-neutral-700 dark:text-neutral-400">
                Grand Total
              </p>
              <p>{priceConversion(GrandTotal, selectedCurrency, true)}</p>
            </div>
          )}

          <StartRating
            point={
              attractionData?.averageRating
                ? Number(attractionData?.averageRating?.toFixed(2))
                : 0
            }
            reviewCount={attractionData?.totalRating}
          />
        </div>

        <div className="">
          <label className="text-xs font-light text-neutral-700 dark:text-neutral-400">
            Select date
          </label>
          <SlideCalender
            handleFunction={handleDateOnclick}
            initialSelection={
              initialDate
                ? new Date(initialDate)
                : activities.length
                ? new Date(activities[0].date)
                : new Date()
            }
          />
        </div>

        {/* FORM */}
        {/* <div className="mb-5">
          <div className="pb-2 px-2 text-lg font-medium text-neutral-900 dark:text-neutral-200">
            Select tour date
          </div>
          <form className="flex flex-col bg-green-500/10 dark:bg-green-600/10 border border-green-600 dark:border-green-700 rounded-3xl ">
            <StayDatesRangeInput
              setDate={setDate}
              attraction={attractionData}
              className="flex-1 z-[11]"
            />
          </form>
        </div> */}

        {/* SUBMIT */}
        {/* <ButtonPrimary
          className="w-full rounded-lg"
          onClick={() => handleAddToCart()}
          //href={`${thisPathname}/activity?date=${date?.toString()}` as Route}
        >
          Checkout
        </ButtonPrimary> */}
      </div>
    );
  };

  const backfunction = () => {
    window?.history?.back();
  }

  
  return (
    <div className={` nc-ListingExperiencesDetailPage  `}>
      <div className="my-3 flex md:flex-row flex-col gap-2 md:justify-between">
        <div onClick={() => backfunction()} className="flex items-center cursor-pointer text-xs md:text-base text-center gap-3">
        <ArrowLeftIcon height={20} width={20} />
        <p>Back</p>
        </div>
        <Breadcrumb breadCrumbs={breadcrum} />
      </div>
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={
          attractionData && attractionData?.images?.length
            ? attractionData?.images
            : [""]
        }
      />
      {/* SINGLE HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 gap-1 sm:gap-2">
          {/* {attractionData && attractionData?.images?.length && (
            <div
              onClick={() => setIsVideoModal(!isVideoModal)}
              className=" col-span-4 row-span-4 md:col-span-3 md:row-span-3 relative min-h-[30vh] md:min-h-[100vh] rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
            >
              {isVideoModal ? (
                <ReactPlayer
                  width={"100%"}
                  height={"100%"}
                  muted
                  playing
                  onClick={() => setIsVideoModal(!isVideoModal)}
                  loop
                  url={`${attractionData?.youtubeLink}?modestbranding=1`}
                />
              ) : (
                <>
                  <Image
                    onClick={() => {
                      console.log("on Click wrking on Image tag");
                      setIsVideoModal(!isVideoModal);
                    }}
                    alt="photo 1"
                    fill
                    className="object-cover  rounded-md sm:rounded-xl"
                    src={`${
                      process.env.NEXT_PUBLIC_CDN_URL +
                      attractionData?.images[0]
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  />
                </>
              )}

              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          )} */}

          {attractionData?.images
            ?.filter((_, i) => i < 3)
            .map((item, index) => (
              <div
                onClick={handleOpenModalImageGallery}
                key={index}
                className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                  index >= 2 ? "block" : ""
                }`}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    alt="photos"
                    fill
                    className="object-cover w-full h-full rounded-md sm:rounded-xl "
                    src={`${process.env.NEXT_PUBLIC_CDN_URL + item}` || ""}
                    sizes="400px"
                  />
                </div>

                {/* OVERLAY */}
                <div
                  className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleOpenModalImageGallery}
                />
              </div>
            ))}
          {attractionData && (
            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={handleOpenModalImageGallery}
            >
              <Squares2X2Icon className="h-5 w-5" />
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Show all photos
              </span>
            </div>
          )}
        </div>
      </header>

      {attractionData && (
        <>
          <div className="relative z-10 mt-4">
            <div className="mt-2">{renderSection1()}</div>
          </div>
        </>
      )}

      {/* Main */}
      <main className="relative z-10 mt-5 flex flex-col lg:flex-row">
        {/* CONTENT */}
        <div className="w-full space-y-8 lg:pr-10 ">
          {attractionData && (
            <>
              {renderActivitySection()}
              {/* {renderSection2()} */}
              {renderSection3()}
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
              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
              >
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
              </div>

              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
              >
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
              </div>

              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
              >
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
              </div>
            </>
          )}
          {/* <SectionDateRange /> */}
          {attractionData?.sections &&
            attractionData?.sections?.map((section) => renderSection5(section))}
          {attractionData ? (
            <>
              {/* {renderSection6()} */}
              {renderSection7(
                attractionData?.latitude,
                attractionData?.longitude
              )}
            </>
          ) : (
            ""
          )}
          {attractionData?.faqs && attractionData?.faqs?.length
            ? renderSection8()
            : ""}
        </div>

        {/* SIDEBAR */}
        {/* <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">
            {attractionData && <>{renderSidebar()}</>}
          </div>
          {!attractionData && (
            <>
              <div className="sticky top-28">
                <div
                  role="status"
                  className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                  <div className="flex items-center justify-center min-w-[100%] min-h-[200px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
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

                <div
                  role="status"
                  className="space-y-8 mt-1 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                  <div className="flex items-center justify-center min-w-[100%] min-h-[200px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
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

                <div className="mt-5">
                  <DefaultLoader />
                </div>
              </div>
            </>
          )}
        </div> */}
      </main>
      {/* STICKY FOOTER MOBILE */}
      {/* <MobileFooterStickyDate attractionData={attractionData} /> */}
    </div>
  );
}

export default AttractionDetails;
