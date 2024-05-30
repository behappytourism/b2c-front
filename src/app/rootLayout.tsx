"use client";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import ClientCommons from "./ClientCommons";
import { ReduxProvider } from "@/redux/provider";
import FetchInitialData from "./FetchInitialData";
import FetchUserData from "./fetchUserData";
import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import SectionDowloadApp from "./(home)/SectionDowloadApp";
import FooterNav from "@/components/FooterNav";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import SuccessAlert from "@/components/alerts/AlertSuccess";

function BasicLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	const pathname = usePathname();
	
	useEffect(() => {
		if (pathname && pathname.startsWith("/b2b")) {
			window.location.replace("https://behappyb2b.com");
		}
	}, [pathname]);

	return (
		<div>
			{" "}
            <SessionProvider>
          <ReduxProvider>
            <ClientCommons />
            <FetchInitialData />
            <FetchUserData />
            <SiteHeader />
            {children}
            <SuccessAlert />
            {/* <SectionDowloadApp /> */}
            <FooterNav />
            <Footer />
          </ReduxProvider>
        </SessionProvider>
		</div>
	);
}

export default BasicLayout;
