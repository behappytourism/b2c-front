"use client";
import React, { FC } from "react";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import SocialsList from "@/shared/SocialsList";
import Label from "@/components/Label";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface PageContactProps {}

const PageContact: FC<PageContactProps> = ({}) => {
  const { globalData } = useSelector((state: RootState) => state.initials);

  const info = [
    {
      title: "🗺DUBAI ADDRESS",
      desc: process.env.NEXT_PUBLIC_COMPANYADDRESS1 || "",
    },
    // {
    //   title: "💌 EMAIL",
    //   desc: globalData?.home?.email || "",
    // },
    {
      title: "☎ PHONE",
      desc: `+${globalData?.home?.phoneNumber1} ${
        globalData?.home?.phoneNumber2
          ? ", +" + globalData?.home?.phoneNumber2
          : ""
      }`,
    },
  ];

  return (
    <div className={`nc-PageContact overflow-hidden`}>
      <div className="mb-24 lg:mb-32">
        <h2 className="my-16 sm:my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Contact
        </h2>
        <div className="container max-w-7xl mx-auto">
          <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-12 ">
            <div className="max-w-sm space-y-8">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                    {item.title}
                  </h3>
                  <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </span>
                </div>
              ))}
              <div>
              <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  🌏 SOCIALS
                </h3>
                <SocialsList className="mt-2" />
                </div>
                <div className="w-full">
                  <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    allowFullScreen={true}
                    marginWidth={0}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.345472026234!2d55.28800837442771!3d25.25896142919806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43535560fdfb%3A0x7a5d842347a95555!2sBE%20HAPPY%20TRAVEL%20%26%20TOURISM%20L.L.C!5e0!3m2!1sen!2sin!4v1713871454852!5m2!1sen!2sin"
                  >
                    <a href="https://www.gps.ie/">gps trackers</a>
                  </iframe>
                </div>
             
            
            </div>
            <div>
              <form className="grid grid-cols-1 gap-6" action="#" method="post">
                <label className="block">
                  <Label>Full name</Label>

                  <Input
                    placeholder="Example Doe"
                    type="text"
                    className="mt-1"
                  />
                </label>
                <label className="block">
                  <Label>Email address</Label>

                  <Input
                    type="email"
                    placeholder="example@example.com"
                    className="mt-1"
                  />
                </label>
                <label className="block">
                  <Label>Country</Label>

                  <Input
                    type="text"
                    placeholder="example@example.com"
                    className="mt-1"
                  />
                </label>
                <label className="block">
                  <Label>Phone Number</Label>

                  <Input
                    type="number"
                    placeholder="example@example.com"
                    className="mt-1 no-spinner"
                  />
                </label>
                <label className="block">
                  <Label>Message</Label>

                  <Textarea className="mt-1" rows={6} />
                </label>
                <div>
                  <ButtonPrimary type="submit">Send Message</ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      {/* <div className="container">
        <SectionSubscribe2 className="pb-24 lg:pb-32" />
      </div> */}
    </div>
  );
};

export default PageContact;
