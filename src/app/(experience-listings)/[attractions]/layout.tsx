import BgGlassmorphism from "@/components/BgGlassmorphism";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`nc-ListingStayPage relative `}>
      {/* SECTION HERO */}

      <div className=" relative  space-y-8 lg:space-y-10 ">
        {children}
      </div>
    </div>
  );
};

export default Layout;
