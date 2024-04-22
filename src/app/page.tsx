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

interface responseTS {
  destinations: []
}
const PageHome = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [attractionData, setAttractionData] = useState();
  const [dest, setDest] = useState("dubai");
  const [response, setResponse] = useState<responseTS>()

  const { attractionDestinations, globalData } = useSelector(
    (state: RootState) => state.initials
  );


  
  

  const findAttraction = async () => {
    try {
      const attraction = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/all?limit=8&skip=0&destination=${dest}`,
        { next: { revalidate: 1 } }
      );
      return attraction.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function attractionFound() {
    try {
      const response = await findAttraction();
      setAttractionData(response);
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    const findAttractionQuery = async () => {
      try {
        const query = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/search/list?search=${""}`, { cache: 'no-store' })
        setResponse(await query.json())
  
      } catch (error) {
        console.log(error);
 
      }
    }

    findAttractionQuery()

  }, [])

  useEffect(() => {
    attractionFound();
  }, [dest]);

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
    return response?.destinations?.map((destination: any) => {
      return destination.slug || "";
    });
  }, [response]);

  
  
  // console.log(attractionData, "attractions");
  // console.log(dest, "tabs");

  
  

  //const tabs = ["dubai", "sharjah", "fujairah", "ras al khaimah", "ajman", "abu dhabi", "oman", "hatta"]

  return (
    <main className="nc-PageHome flex justify-center relative overflow-hidden">
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="relative container md:mb-16 mb-16 lg:mb-16">
        {/* SECTION HERO */}
        <SectionHero
          currentPage="Experiences"
          currentTab="Experiences"
          className="hidden lg:block pt-10 lg:pt-16 lg:pb-16 "
        />

        <div className="relative container space-y-10 lg:space-y-12 md:mt-[180px]">
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

          {attractionDestinations.length > 0 && (
            <SectionSliderNewCategories destinations={attractionDestinations} />
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

          {attractionDestinations.length === 0 && (
            <>
              <ComponentLoader />
              <ComponentLoader />
              <ComponentLoader />
              <ComponentLoader />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default PageHome;
