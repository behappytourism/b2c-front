import { Poppins } from "next/font/google";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import BasicLayout from "./rootLayout";
import { Metadata } from "next";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: {
    default: `Travel Agency in Dubai | Best Tourism Company UAE | ${process.env.NEXT_PUBLIC_TITLE_SHORT_NAME}`,
    template: `%s | ${process.env.NEXT_PUBLIC_TITLE_SHORT_NAME}`
  },
  keywords: [
    "travel agency in dubai",
    "tourism company in dubai",
    "best travel company in dubai",
    "tour agency",
    "travel and tours",
    "travels in dubai",
    "tour and travel agency",
    "travel agency dubai",
    "travel agency uae",
  ],
  description: `Explore Dubai with our tour and travel agency in UAE. Visa services, hotel booking, and airport transfers available. Experienced team. Best services. Contact today!`
}





export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {


  return (
    <html lang="en" className={poppins.className}>
      <head>
      <link rel="icon" id="companyLogo" type="image/svg+xml" href={process.env.NEXT_PUBLIC_COMPANY_FAVICON} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />


      {/* Google Tag Manager */}
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID}`} />
      <Script dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID}');
          `
      }} />
      {/* End Google Tag Manager */}

      </head>

      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <BasicLayout children={children} params={params} />
      </body>
    </html>
  );
}
