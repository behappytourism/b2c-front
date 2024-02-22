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

const PageHome = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [attractionData, setAttractionData] = useState();
  const [dest, setDest] = useState("dubai");

  const { attractionDestinations, globalData } = useSelector(
    (state: RootState) => state.initials
  );

  const findAttraction = async () => {
    try {
      // const attraction = await fetch('https://jsonplaceholder.typicode.com/todos/1')
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
    <main className="nc-PageHome container relative overflow-hidden">
      <BgGlassmorphism />

      <div className="relative md:mb-16 mb-16 lg:mb-16">
        <SectionHero
          currentPage="Transfer"
          currentTab="Transfer"
          className="hidden lg:block pt-10 lg:pt-16 lg:pb-16 "
        />

        <div className=" relative container space-y-10 lg:space-y-12 mt-[500px]"></div>
      </div>
    </main>
  );
};

export default PageHome;
