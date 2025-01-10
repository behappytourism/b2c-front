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
import BlogsCard from "@/components/Attraction/BlogsCard";
import BlogsSlider from "@/components/Attraction/BlogsSlider";
import SliderStandAlone from "@/components/Attraction/SliderStandAlone";

interface responseTS {
  destinations: [];
}

interface standalones {
  standAlones: [];
}

interface bannerImages {
  img: string;
}

const LandingPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [attractionData, setAttractionData] = useState();
  const [dest, setDest] = useState("all");
  const [response, setResponse] = useState<responseTS>();
  const [banner, setBanner] = useState<bannerImages[]>([]);
  const [standAloneAttr, setStandAloneAttr] = useState<standalones>();

  const { attractionDestinations, globalData } = useSelector(
    (state: RootState) => state.initials
  );

  const findAttraction = async () => {
    try {
      const attraction = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/all?limit=100&skip=0&destination=${dest}`,
        { next: { revalidate: 1 } }
      );
      const data = await attraction.json();
      setAttractionData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const findAttractionQuery = async () => {
    try {
      const query = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/search/list?search=${""}`,
        { cache: "no-store" }
      );
      setResponse(await query.json());
    } catch (error) {
      console.log(error);
    }
  };

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

      const data = await response.json();
      dispatch(setUser(data));
    } catch (error) {
      console.log(error);
    }
  };

  const findBanner = async () => {
    try {
      const banner = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/banners?name=home`,
        { next: { revalidate: 1 } }
      );
      const data = await banner.json();
      setBanner(data);
    } catch (error) {
      console.log(error);
    }
  };

  const tabs: string[] = useMemo(() => {
    let destinations: string[] =
      response?.destinations?.map(
        (destination: any) => destination.name || ""
      ) || [];
    destinations.unshift("all");
    return destinations;
  }, [response]);

  const findStandAloneAttraction = async () => {
    try {
      const attraction = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/standalone/all`,
        { next: { revalidate: 1 } }
      );
      const data = await attraction.json();
      setStandAloneAttr(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findBanner();
    findAttractionQuery();
    findStandAloneAttraction();
  }, []);

  useEffect(() => {
    findAttraction();
  }, [dest]);

  useEffect(() => {
    if (session) {
      googleSignIn();
    }
  }, [session]);

  // console.log(attractionData, "attractions");
  // console.log(dest, "tabs");
  console.log(standAloneAttr);
  

  //const tabs = ["dubai", "sharjah", "fujairah", "ras al khaimah", "ajman", "abu dhabi", "oman", "hatta"]

  return (
    <>
      {banner?.length === 0 && (
        <main className="nc-PageHome flex justify-center relative overflow-hidden">
          <div className="flex flex-col gap-5">
            <ComponentLoader />
            <ComponentLoader />
            <ComponentLoader />
            <ComponentLoader />
          </div>
        </main>
      )}
      {banner?.length > 0 && (
        <main className="nc-PageHome relative overflow-hidden">
          {/* GLASSMOPHIN */}
          <BgGlassmorphism />

          <div className="relative  md:mb-16 mb-16 lg:mb-16 pt-5 md:pt-0">
            {/* SECTION HERO */}
            {attractionData && (
              <SectionHero
                currentPage="Experiences"
                currentTab="Experiences"
                className="hidden lg:block pt-10 lg:pt-16 lg:pb-16 "
                imgBanner={banner}
              />
            )}

            <div className="relative container space-y-10 lg:space-y-12 md:mt-[10px]">
              {/* SECTION 1 */}

              {globalData.topAttractions?.length ? (
                <SliderCards
                  data={globalData.topAttractions}
                  heading="Top attractions"
                  subHeading="Visit our top listed attractions."
                />
              ) : (
                ""
              )}

              <SliderStandAlone
                data={standAloneAttr?.standAlones}
                heading="Popular Attractions"
                subHeading="Visit our popular listed packages"
              />

              {attractionDestinations.length > 0 && (
                <SectionSliderNewCategories
                  destinations={attractionDestinations}
                />
              )}

              {globalData.bestSellingAttractions?.length ? (
                <SliderCards
                  data={globalData.bestSellingAttractions}
                  heading="Best selling attractions"
                  subHeading="Visit our best selling attractions."
                />
              ) : (
                ""
              )}

              {/* <SectionOurFeatures /> */}
              {attractionData && (
                <SectionGridFilterAttractionCard
                  data={attractionData}
                  tabs={tabs}
                  setDest={setDest}
                  className="md:pb-24 lg:pb-28"
                />
              )}

              <div>
                <div className="w-full">
                  <BlogsSlider data={globalData.blogs} />
                </div>
              </div>

              {attractionDestinations.length === 0 && (
                <>
                  <div className="flex flex-col gap-5">
                    <ComponentLoader />
                    <ComponentLoader />
                    <ComponentLoader />
                    <ComponentLoader />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default LandingPage;
