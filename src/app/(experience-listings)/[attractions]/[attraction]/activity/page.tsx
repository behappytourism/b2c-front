"use client";


import { useEffect, useMemo, useState } from "react";
import ActivityListCard from "./ActivityListCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleAddtocart, handleDateChange, storeAttractionActivity } from "@/redux/features/attractionSlice";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "next";
import SlideCalender from "@/shared/Calender/SlideCalender";
import priceConversion from "@/utils/priceConversion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import { ActivityExcursion, ExcursionDetails, TimeSlotExcursion } from "@/data/attraction/types";
import MobileFooterStickyAttraction from "./MobileFooterStickyAttraction";
import ErrorModal from "@/shared/Status/ErrorModal";

interface ActivityDetailPageProps {
  params: { attractions: string; attraction: string };
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

const findSlotsAvailable = async ({ activity, jwtToken }: { activity: ActivityExcursion, jwtToken: string }) => {
  try {
    const slots = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/timeslot`,
      {
        method: "POST",
        body: JSON.stringify({
          productId: activity?.productId,
          productCode: activity?.productCode,
          timeSlotDate: activity?.date,
          activityId: activity?._id
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    const res: TimeSlotExcursion[] = await slots.json()

    return res
  } catch (error) {
    console.log(error);
  }
};


function ActivityDetailPage<ActivityDetailPageProps>({
  params,
}: {
  params: { attractions: string; attraction: string };
}) {
  const thisPathname = usePathname();
  const router = useRouter()
  const { attraction } = params;
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>();

  // Fetching initial Date from query
  const initialDate = searchParams.get("date")

  const { activities } = useSelector((state: RootState) => state.attraction);
  const { selectedCurrency } = useSelector((state: RootState) => state.initials)

  const [attractionData, setAttractionData] = useState<ExcursionDetails>()
  const [addToCart, setAddToCart] = useState(false);
  const [ATCIndex, setATCIndex] = useState(0);


  // Fetching the attraction details.
  useEffect(() => {
    const fecthApiResponse = async (attraction: string) => {
      try {
        const response = await findAttraction(attraction);
        // dispatch  attraction activities.
        setAttractionData(response)
        dispatch(storeAttractionActivity({ activity: response.activities, attraction: response, initialDate: initialDate }));
      } catch (error) {
        console.log(error);
      }
    };
    fecthApiResponse(attraction);
  }, [attraction]);


  const selectedActivities = useMemo(() => {
    return activities.filter((activity) => activity.isChecked)
  }, [activities])


  // Making breadcrums data.
  const parts = thisPathname?.split('/').filter(part => part !== '');
  let link = ""
  const breadcrum: BreadcrumbsList[] = parts.map((item) => {
    link += `/${item}`
    return {
      name: item,
      link: link,
      classNames: ""
    }
  })

  const [errorModalContent, setErrorModalContent] = useState("")
3
  const handleCloseErrorModal = () => {
    setErrorModalContent("")
  }

  // handle add to cart data and navigate to checkout page.
  const handleAddToCart = () => {
    try {
      setErrorModalContent("")
      for (let i = 0; i < selectedActivities?.length; i++) {
        if (selectedActivities[i]?.slotsAvailable?.length) {
          if (!selectedActivities[i].hasOwnProperty("slot")) {
            throw new Error("Select the slot for the next step")
          } else if (!selectedActivities[i]?.slot.hasOwnProperty("EventID")) {
            throw new Error("Select the slot for the next step")
          }
        }
      }
      dispatch(handleAddtocart(selectedActivities))
      router.push(`${thisPathname}/checkout` as Route)
    } catch (error) {
      setErrorModalContent(`${error}`)
    }

  }

  //Handle Date onclick function.
  const handleDateOnclick = (date: Date | string) => {
    if (new Date(date) < new Date()) {
      return
    }
    dispatch(handleDateChange(date))
  }


  // Total sum in th cart
  const GrandTotal: number = useMemo(() => {
    let val: number = selectedActivities.reduce((acc, item) => {
      return acc + item.grandTotal
    }, 0)
    return val
  }, [activities])

  const renderIfEmptyActivitySection = () => {
    return (
      <div className="">
        <p className="font-mono">
          Sorry. No Activities found on this attraction.
        </p>
      </div>
    );
  };

  const renderDateSlider = () => {
    return (
      <div className="">
        <div className=" font-semibold text-2xl  capitalize">
          Select date
        </div>
        <SlideCalender  handleFunction={handleDateOnclick} initialSelection={initialDate ? new Date(initialDate) : activities.length ? new Date(activities[0].date) : new Date()} />
      </div>
    )
  }

  const renderSidebar = () => {
    return (
      <div className="rounded-xl shadow-2xl p-5 max-w-sm">

        {/* SUM */}
        {activities.length ? (
          <div className="flex flex-col space-y-4 mb-5">
            {selectedActivities.map((activity) => (
              <div>
                <p className="font-medium text-sm pb-5">{activity.name}</p>
                <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                  <span>Price</span>
                  <span>{priceConversion(activity.grandTotal, selectedCurrency, true)}</span>
                </div>
              </div>
            ))}
            <hr />
            <div className="">
              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                <span>Grand Total</span>
                <span>{priceConversion(GrandTotal, selectedCurrency, true)}</span>
              </div>
            </div>
          </div>
        ) : ""}

        {/* SUBMIT */}
        <div>
        <ButtonPrimary className="w-full" onClick={() => handleAddToCart()}>Checkout</ButtonPrimary>
        </div>
      </div>
    );
  };


  return (
    <div className="relative z-10 mt-11 flex flex-col  gap-10">
      {/* BREADCRUMBS */}
      <Breadcrumb breadCrumbs={breadcrum} />
      <div className="flex flex-col  gap-10 lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-2/3 ">
          {/* Date Picker section */}
          {renderDateSlider()}

          {/* Choose Activity */}
          <div className="pt-7">
            <div className="font-semibold text-2xl pb-8 capitalize">
              Choose your preference
            </div>
            {activities.length ? (
              <div className="grid  md:grid-cols-2 gap-4">
                {activities?.map((activity, index) => {
                  return (
                    <ActivityListCard
                      key={activity?._id}
                      attraction={attractionData}
                      data={activity}
                      index={index}
                      setAddToCart={setAddToCart}
                      addToCart={addToCart}
                      checkout={addToCart}
                      setCheckout={setAddToCart}
                      setATCIndex={setATCIndex}
                      findSlotsAvailable={findSlotsAvailable}
                    />
                  );
                })}
              </div>
            ) : (
              <>{renderIfEmptyActivitySection()}</>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        {selectedActivities && selectedActivities.length ? (
          <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
            <div className="sticky top-28">{renderSidebar()}</div>
            <ErrorModal isOpen={errorModalContent?.length > 0} closeModal={handleCloseErrorModal} title=" Something went wrong!" text={errorModalContent} />
          </div>
        ) : ""}
      </div>
      {/* STICKTY FOOTER */}
      {selectedActivities?.length ? (
        <MobileFooterStickyAttraction total={GrandTotal} activities={selectedActivities} />
      ) : ""}
    </div>
  );
}

export default ActivityDetailPage;
