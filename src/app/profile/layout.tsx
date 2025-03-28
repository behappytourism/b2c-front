"use client";

import React, { FC, useEffect, useState } from "react"; import ProfileSideBar from "./ProfileSideBar";


export interface CommonLayoutProps {
    children?: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        // Check if the user is at the bottom of the page
        const isBottom =
          window.innerHeight + window.scrollY >= document.body.scrollHeight;
        setIsAtBottom(isBottom);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
        <div className={`nc-AuthorPage relative overflow-hidden`}>
            <main className="container md:mt-12 mb-24 lg:mb-32">
                <div className="w-full md:space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
                    {children}
                </div>
                <div className="relative mt-10 inset-0 flex justify-center container mb-24 lg:mb-0">
  {!isAtBottom && (
            <div className="lg:fixed bg-white dark:bg-neutral-800 rounded-xl bottom-10 border-white shadow-xl z-10 hidden md:block">
              <ProfileSideBar />
            </div>
          )}
                          </div>
            </main>
        </div>
    );
};

export default CommonLayout;
