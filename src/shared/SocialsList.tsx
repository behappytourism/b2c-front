import { RootState } from "@/redux/store";
import { SocialType } from "@/shared/SocialsShare";
import React, { FC } from "react";
import { useSelector } from "react-redux";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
}


const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block",
}) => {

  const { globalData } = useSelector((state: RootState) => state.initials)

  const socialsDemo: SocialType[] = [
    { name: "Facebook", icon: "lab la-facebook-square", href: globalData?.home?.facebookUrl || "" },
    { name: "Whatsapp", icon: "lab la-whatsapp", href: `https://wa.me/${globalData?.home?.phoneNumber2}` },
    { name: "Instagram", icon: "lab la-instagram", href: globalData?.home?.instagramUrl || "" },
  ];

  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socialsDemo.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <i className={item.icon}></i>
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;
