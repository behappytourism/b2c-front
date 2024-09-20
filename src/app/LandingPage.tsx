// "use client";

// import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
// import SectionHero from "@/app/(server-components)/SectionHero";
// import BgGlassmorphism from "@/components/BgGlassmorphism";
// import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
// import SectionGridFilterAttractionCard from "@/components/Attraction/SectionGridFilterAttractionCard";
// import { useDispatch, useSelector } from "react-redux";
// import { useSession } from "next-auth/react";
// import { RootState } from "@/redux/store";
// import { setUser } from "@/redux/features/usersSlice";
// import { fetchAffiliateUser } from "@/redux/features/affiliatesSlice";
// import ComponentLoader from "@/components/loader/ComponentLoader";
// import SliderCards from "@/components/Attraction/SliderCards";

// interface responseTS {
//   destinations: [];
// }

// interface bannerImages {
//   img: string;
// }

// const LandingPage = () => {
//   const dispatch = useDispatch();
//   const { data: session } = useSession();
//   const [attractionData, setAttractionData] = useState();
//   const [dest, setDest] = useState("all");
//   const [response, setResponse] = useState<responseTS>();
//   const [banner, setBanner] = useState<bannerImages[]>([]);

//   const { attractionDestinations, globalData } = useSelector(
//     (state: RootState) => state.initials
//   );

//   const findAttraction = async () => {
//     try {
//       const attraction = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/all?limit=100&skip=0&destination=${dest}`,
//         { next: { revalidate: 1 } }
//       );
//       return attraction.json();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   async function attractionFound() {
//     try {
//       const response = await findAttraction();
//       setAttractionData(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   useEffect(() => {
//     const findAttractionQuery = async () => {
//       try {
//         const query = await fetch(
//           `${
//             process.env.NEXT_PUBLIC_SERVER_URL
//           }/api/v1/search/list?search=${""}`,
//           { cache: "no-store" }
//         );
//         setResponse(await query.json());
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     findAttractionQuery();
//   }, []);

//   useEffect(() => {
//     attractionFound();
//   }, [dest]);

//   const googleSignIn = async () => {
//     const payload = {
//       email: session?.user?.email,
//       name: session?.user?.name,
//     };

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/emailLogin`,
//         {
//           method: "POST",
//           body: JSON.stringify(payload),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response.json();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   async function googleProcess() {
//     try {
//       const response = await googleSignIn();
//       dispatch(setUser(response));
//       // dispatch(fetchAffiliateUser() as any);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   useEffect(() => {
//     {
//       session && googleProcess();
//     }
//   }, [session]);

//   const findBanner = async () => {
//     try {
//       const banner = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/banners?name=home`,
//         { next: { revalidate: 1 } }
//       );
//       return banner.json();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   async function bannerFound() {
//     try {
//       const response = await findBanner();
//       setBanner(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   useEffect(() => {
//     bannerFound();
//   }, []);

//   const tabs: string[] = useMemo(() => {
//     let destinations: string[] =
//       response?.destinations?.map(
//         (destination: any) => destination.name || ""
//       ) || [];
//     destinations.unshift("all");
//     return destinations;
//   }, [response]);

//   // console.log(attractionData, "attractions");
//   // console.log(dest, "tabs");

//   //const tabs = ["dubai", "sharjah", "fujairah", "ras al khaimah", "ajman", "abu dhabi", "oman", "hatta"]

//   return (
//     <>
//       {banner?.length === 0 && (
//         <main className="nc-PageHome flex justify-center relative overflow-hidden">
//           <div className="flex flex-col gap-5">
//             <ComponentLoader />
//             <ComponentLoader />
//             <ComponentLoader />
//             <ComponentLoader />
//           </div>
//         </main>
//       )}
//       {banner?.length > 0 && (
//         <main className="nc-PageHome flex justify-center relative overflow-hidden">
//           {/* GLASSMOPHIN */}
//           <BgGlassmorphism />

//           <div className="relative mb-16">
//             {/* SECTION HERO */}
//             {attractionData && (
//               <SectionHero
//                 currentPage="Experiences"
//                 currentTab="Experiences"
//                 className="hidden lg:block pt-10 lg:pt-16 lg:pb-16 "
//                 imgBanner={banner}
//               />
//             )}

//             <div className="container space-y-10 lg:space-y-12 mt-[10px]">
//               {/* SECTION 1 */}

//               {globalData.topAttractions?.length ? (
//                 <SliderCards
//                   data={globalData.topAttractions}
//                   heading="Top attractions"
//                   subHeading="Visit our top listed attractions."
//                 />
//               ) : (
//                 ""
//               )}

//               {attractionDestinations.length > 0 && (
//                 <SectionSliderNewCategories
//                   destinations={attractionDestinations}
//                 />
//               )}

//               {globalData.bestSellingAttractions?.length ? (
//                 <SliderCards
//                   data={globalData.bestSellingAttractions}
//                   heading="Best selling attractions"
//                   subHeading="Visit our best selling attractions."
//                 />
//               ) : (
//                 ""
//               )}

//               {/* <SectionOurFeatures /> */}
//               {attractionData && (
//                 <SectionGridFilterAttractionCard
//                   data={attractionData}
//                   tabs={tabs}
//                   setDest={setDest}
//                   className="md:pb-24 lg:pb-28"
//                 />
//               )}

//               {attractionDestinations.length === 0 && (
//                 <>
//                   <div className="flex flex-col gap-5">
//                     <ComponentLoader />
//                     <ComponentLoader />
//                     <ComponentLoader />
//                     <ComponentLoader />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </main>
//       )}
//     </>
//   );
// };

// export default LandingPage;

"use client";

import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/features/usersSlice";
import { fetchAffiliateUser } from "@/redux/features/affiliatesSlice";

const SectionHero = lazy(() => import("@/app/(server-components)/SectionHero"));
const BgGlassmorphism = lazy(() => import("@/components/BgGlassmorphism"));
const SectionSliderNewCategories = lazy(
  () => import("@/components/SectionSliderNewCategories")
);
const SectionGridFilterAttractionCard = lazy(
  () => import("@/components/Attraction/SectionGridFilterAttractionCard")
);
const SliderCards = lazy(() => import("@/components/Attraction/SliderCards"));
const ComponentLoader = lazy(
  () => import("@/components/loader/ComponentLoader")
);

interface responseTS {
  destinations: [];
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

  const { attractionDestinations, globalData } = useSelector(
    (state: RootState) => ({
      attractionDestinations: state.initials.attractionDestinations,
      globalData: state.initials.globalData,
    })
  );

  // Fetch function to combine attraction and banner data in one API call (if possible)
  const fetchAllData = async () => {
    try {
      const [attractionRes, bannerRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/all?limit=100&skip=0&destination=${dest}`,
          {
            next: { revalidate: 1 },
          }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/banners?name=home`,
          {
            next: { revalidate: 1 },
          }
        ),
      ]);

      const attractionData = await attractionRes.json();
      const bannerData = await bannerRes.json();

      setAttractionData(attractionData);
      setBanner(bannerData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dest]);

  // Google sign-in process
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

  const googleProcess = async () => {
    try {
      const response = await googleSignIn();
      dispatch(setUser(response));
      // dispatch(fetchAffiliateUser() as any); // Uncomment if needed
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session) googleProcess();
  }, [session]);

  // Memoize tabs to avoid re-rendering
  const tabs: string[] = useMemo(() => {
    const destinations: string[] =
      response?.destinations?.map(
        (destination: any) => destination.name || ""
      ) || [];
    destinations.unshift("all");
    return destinations;
  }, [response]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {banner?.length === 0 ? (
        <main className="nc-PageHome flex justify-center relative overflow-hidden">
          <div className="flex flex-col gap-5">
            <ComponentLoader />
            <ComponentLoader />
            <ComponentLoader />
            <ComponentLoader />
          </div>
        </main>
      ) : (
        <main className="nc-PageHome flex justify-center relative overflow-hidden">
          {/* GLASSMORPHISM */}
          <BgGlassmorphism />

          <div className="relative mb-16">
            {/* SECTION HERO */}
            {attractionData && (
              <SectionHero
                currentPage="Experiences"
                currentTab="Experiences"
                className="hidden lg:block pt-10 lg:pt-16 lg:pb-16"
                imgBanner={banner}
              />
            )}

            <div className="container space-y-10 lg:space-y-12 mt-[10px]">
              {/* SECTION 1 */}

              {globalData.topAttractions?.length > 0 && (
                <SliderCards
                  data={globalData.topAttractions}
                  heading="Top attractions"
                  subHeading="Visit our top listed attractions."
                />
              )}

              {attractionDestinations.length > 0 && (
                <SectionSliderNewCategories
                  destinations={attractionDestinations}
                />
              )}

              {globalData.bestSellingAttractions?.length > 0 && (
                <SliderCards
                  data={globalData.bestSellingAttractions}
                  heading="Best selling attractions"
                  subHeading="Visit our best selling attractions."
                />
              )}

              {attractionData && (
                <SectionGridFilterAttractionCard
                  data={attractionData}
                  tabs={tabs}
                  setDest={setDest}
                  className="md:pb-24 lg:pb-28"
                />
              )}

              {attractionDestinations.length === 0 && (
                <div className="flex flex-col gap-5">
                  <ComponentLoader />
                  <ComponentLoader />
                  <ComponentLoader />
                  <ComponentLoader />
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </Suspense>
  );
};

export default LandingPage;
