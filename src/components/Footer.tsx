"use client";

import Logo from "@/shared/Logo";
import SocialsList1 from "@/shared/SocialsList1";
import FooterNav from "./FooterNav";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";




const Footer: React.FC = () => {

  const { globalData } = useSelector((state: RootState) => state.initials)

  return (
    <>
      <FooterNav />

      <div className="nc-Footer relative pb-28 pt-5 lg:pt-16 lg:py-4 border-t border-neutral-200 dark:border-neutral-700">
      <div className="container flex flex-col gap-1 md:grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-20 ">
          <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
            <div className="col-span-2 md:col-span-1">
              {/* <Logo imgLight={process.env.NEXT_PUBLIC_COMPANY_LOGO} img={process.env.NEXT_PUBLIC_COMPANY_LOGO} className="" /> */}
             <Image className="max-w-[200px]" src={process.env.NEXT_PUBLIC_COMPANY_LOGO || ""} alt="company logo" height={100} width={1000} />
            </div>
     
          </div>
          {globalData.home && globalData.home?.footer && globalData.home?.footer?.map((ele, index) => {
            return (
              <div key={index} className="text-sm">
                <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {ele.title}
                </h2>
                <ul className="mt-5 space-y-4">
                  {ele.navLinks.map((item, index) => (
                    <li key={index}>
                      <a
                        key={index}
                        className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                        href={item?.link}
                      >
                        {item?.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}


          <div>
          <div className="col-span-2 flex items-center md:col-span-3">
              <SocialsList1 className="md:flex items-center space-x-3 lg:space-x-0 lg:flex-col lg:space-y-2.5 lg:items-start" />
            </div>
          </div>

          
        </div>

        <div className="flex container justify-center mt-5">
          <p className="text-sm">
          All Rights Reserved by Be Happy Travel & Tourism L.L.C.
          </p>
        </div>



      </div>
    </>
  );
};

export default Footer;
