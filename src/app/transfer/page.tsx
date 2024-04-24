"use client";

import React, { useEffect, useMemo, useState } from "react";
import SectionHero from "@/app/(server-components)/SectionHero";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";

import SectionGridFilterAttractionCard from "@/components/Attraction/SectionGridFilterAttractionCard";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/features/usersSlice";
import { fetchAffiliateUser } from "@/redux/features/affiliatesSlice";
import ComponentLoader from "@/components/loader/ComponentLoader";
import SliderCards from "@/components/Attraction/SliderCards";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import TransferSearchForm from "./TransferSearchForm";
import SkeletonLoader from "../profile/orders/SkeletonLoader";

const PageHome = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [attractionData, setAttractionData] = useState();
  const [dest, setDest] = useState("dubai");

  const { attractionDestinations, globalData } = useSelector(
    (state: RootState) => state.initials
  );

  const [banner, setBanner] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const findBanner = async () => {
    try {
      const banner = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/banners?name=transfer`,
        { next: { revalidate: 1 } }
      );
      return banner.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function bannerFound() {
    try {
      const response = await findBanner();
      setBanner(response);
    } catch (error) {
      console.error(error);
    }
  }

  
   useEffect(() => {
    bannerFound()
   },[])


  const googleSignIn = async () => {
    const payload = {
      email: session?.user?.email,
      name: session?.user?.name,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/emailLogin`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function googleProcess() {
    try {
      const response = await googleSignIn();
      dispatch(setUser(response));
      dispatch(fetchAffiliateUser() as any);
      // {response?.jwtToken && (
      //   router.push("/")
      // )}
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    {
      session && googleProcess();
    }
  }, [session]);

  const tabs = useMemo(() => {
    return attractionDestinations.map((destination) => {
      return destination.name || "";
    });
  }, []);

  return (
    <main className="nc-PageHome min-h-[650px] relative overflow-hidden">
      {banner && (
      <>
      <BgGlassmorphism />

      {/* <div className="relative md:mb-16 mb-16 lg:mb-16">
        <SectionHero
          currentPage="Transfer"
          currentTab="Transfer"
          className="hidden lg:block top-[400px] lg:pt-16 lg:pb-16 -ml-[300px]"
        />

        <div className=" relative container space-y-10 lg:space-y-12 mt-[500px]"></div>
      </div> */}

<div className="hidden md:grid md:grid-cols-1 ">
      <Carousel
          infiniteLoop
          autoPlay
          showThumbs={false}
          interval={9000}
          showArrows={false}
          stopOnHover
          swipeable={false}
          selectedItem={currentSlide}
          showIndicators={false}
          showStatus={false}
          onChange={updateCurrentSlide}
        >
          {banner &&
            banner.map((item: any, index: number) => (
              <>
                <div className="absolute z-20 xl:bottom-20 md:bottom-[15em] lg:bottom-[9.5em]">
                  <p
                    className="ml-10 cursor-pointer -mb-10 text-2xl font-bold text-gray-400 hover:text-gray-400 bg-transparent border-2 transition-all duration-300 border-white hover:bg-soft h-14 w-14 rounded-full flex justify-center items-center"
                    onClick={() => setCurrentSlide(currentSlide + 1)}
                  >
                    <ChevronRightIcon />
                  </p>
                </div>

                <div
                   onClick={() => {
                    if (item?.buttonUrl !== "") {
                      window.open(`${item.buttonUrl}`, "_blank");
                    }
                  }}
                  className="bg-inherit cursor-pointer h-[20em] md:h-[30em] relative object-cover"
                  key={index}
                >
                  <p className="absolute  -top-[350px] text-center w-full z-10">
                    <div className="h-[20em] xl:h-[28em] lg:h-[23em] md:h-[18em] sm:h-[22em] flex flex-col justify-end">
                      <div className="flex justify-center">

                        <p
                          className="text-3xl w-fit  bg-black/50 p-2 text-white font-extrabold  heading uppercase"
                          style={{
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            backgroundColor: item.title ? "rgba(0, 0, 0, 0.5)" : "transparent",

                          }}
                        >
                          {item?.title}
                        </p>
                        
                        <div
                          className=" text-sm text-white font-medium"
                          style={{
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          {item?.description}
                        </div>
                      </div>
                    </div>
                  </p>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image || ""}`}
                    alt={`Slide ${index + 1}`}
                    width={1000}
                    height={100}
                    className=""
                  />
                </div>
              </>
            ))}
        </Carousel>
      </div>

      <div className="container w-full flex justify-center -mt-[320px]">
        <div className="sticky ml-[250px]">
        <TransferSearchForm />
        </div>
      </div>
      </>
      )}
    </main>
  );
};

export default PageHome;
