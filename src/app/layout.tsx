"use client"
import { Poppins } from "next/font/google";
import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import ClientCommons from "./ClientCommons";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";
import { ReduxProvider } from "@/redux/provider";
import FetchInitialData from "./FetchInitialData";
import { SessionProvider } from "next-auth/react"
import FetchUserData from "./fetchUserData";
import SectionDowloadApp from "./(home)/SectionDowloadApp";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});



export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {


  return (
    <html lang="en" className={poppins.className}>
      <title id="title">{process.env.NEXT_PUBLIC_TITLE_SHORT_NAME}</title>
      <link rel="icon" id="companyLogo" type="image/svg+xml" href={process.env.NEXT_PUBLIC_COMPANY_FAVICON} />


      {/* Google Tag Manager */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID}`}></script>
      <script dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID}');
          `
      }}></script>
      {/* End Google Tag Manager */}

      {/* Tawk.to Script */}
      <script type="text/javascript" dangerouslySetInnerHTML={{
        __html: `
            var Tawk_API = Tawk_API || {};
            Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/64a7dfde94cf5d49dc6219cb/1h4ns505j';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `,
      }} />
      {/* End of Tawk.to Script */}

      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <SessionProvider>
          <ReduxProvider>
            <ClientCommons />
            <FetchInitialData />
            <FetchUserData />
            <SiteHeader />
            {children}
            <SectionDowloadApp />
            <FooterNav />
            <Footer />
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
