import { RootState } from "@/redux/store";
import { SocialType } from "@/shared/SocialsShare";
import React, { FC } from "react";
import { useSelector } from "react-redux";

export interface SocialsList1Props {
  className?: string;
}



const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-2.5" }) => {


  const { globalData } = useSelector((state: RootState) => state.initials)
  
  const socials: SocialType[] = [
    { name: "Facebook", icon: "lab la-facebook-square", href: globalData?.home?.facebookUrl || "" },
    { name: "Whatsapp", icon: "lab la-whatsapp", href: `https://wa.me/${globalData?.home?.phoneNumber2}` },
    { name: "Instagram", icon: "lab la-instagram", href: globalData?.home?.instagramUrl || "" },
    { name: "Youtube", icon: "lab la-youtube", href: globalData?.home?.youtubeUrl || "" },
    { name: "Twitter", icon: "lab la-twitter", href: globalData?.home?.twitterUrl || "" },
  ];


  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
        key={index}
      >
        <i className={item.icon}></i>
        <span className="hidden lg:block text-sm">{item.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
