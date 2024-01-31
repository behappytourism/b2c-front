"use client";

import React, { FC, useState } from "react";
import StaySearchForm from "./(stay-search-form)/StaySearchForm";
import ExperiencesSearchForm from "./(experiences-search-form)/ExperiencesSearchForm";
import RentalCarSearchForm from "./(car-search-form)/RentalCarSearchForm";
import FlightSearchForm from "./(flight-search-form)/FlightSearchForm";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { TicketIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { TicketIcon as SolidTicketIcon, SparklesIcon as SolidSparkle } from "@heroicons/react/24/solid";


export type SearchTab = "Stays" | "Experiences" | "Visa" | "Flights";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: "Stays" | "Experiences" | "Visa" | "Flights";
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Experiences",
  currentPage,
}) => {
  const router = useRouter(); // Initialize the router object

  // const tabs: SearchTab[] = ["Stays", "Experiences", "Cars", "Flights"];
  const tabs: SearchTab[] = ["Experiences", "Visa"]
  const [tabActive, setTabActive] = useState<SearchTab>(currentTab);


  const renderTab = () => {
    return (
      <ul className="ml- sm:ml- md:ml- hidden md:flex space-x-5 sm:space-x-8 lg:space-x-3 overflow-x-auto hiddenScrollbar">
        {tabs.map((tab) => {

          const renderIcons = (tab: SearchTab) => {
            switch (tab) {
              case 'Experiences':
                return tabActive === "Experiences" ? <SolidSparkle /> : <SparklesIcon color="black" />
              case 'Flights':
                return <svg fill="#ffffff" viewBox="0 0 512 512" enable-background="new 0 0 512 512" id="plane" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" transform="rotate(45)" stroke="#000000" strokeWidth="0.00512"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M393.158,135.677c1.308,1.249,2.985,1.869,4.661,1.869c1.78,0,3.556-0.699,4.882-2.087 c2.575-2.695,2.478-6.968-0.217-9.543l-14.116-13.485c-2.697-2.576-6.969-2.478-9.544,0.218c-2.574,2.695-2.477,6.968,0.218,9.543 L393.158,135.677z"></path> <path d="M264.002,311.413l-5.928,5.419c-2.751,2.515-2.942,6.784-0.427,9.537c1.331,1.455,3.154,2.194,4.983,2.194 c1.627,0,3.258-0.584,4.554-1.768l5.927-5.419c2.752-2.515,2.943-6.784,0.428-9.536 C271.023,309.09,266.756,308.899,264.002,311.413z"></path> <path d="M311.643,267.869l-29.888,27.319c-2.753,2.515-2.944,6.784-0.429,9.535c1.332,1.457,3.155,2.196,4.984,2.196 c1.626,0,3.257-0.584,4.552-1.768l29.888-27.319c2.752-2.516,2.943-6.784,0.428-9.535 C318.662,265.545,314.393,265.355,311.643,267.869z"></path> <path d="M195.624,247.017l23.696-23.779c2.631-2.641,2.623-6.914-0.018-9.545c-2.639-2.632-6.914-2.625-9.546,0.017l-23.696,23.779 c-2.632,2.641-2.623,6.915,0.018,9.546c1.316,1.313,3.04,1.968,4.764,1.968C192.573,249.002,194.306,248.34,195.624,247.017z"></path> <path d="M235.18,207.323l5.032-5.049c2.632-2.64,2.624-6.914-0.017-9.545c-2.641-2.633-6.914-2.625-9.547,0.017l-5.031,5.049 c-2.632,2.64-2.624,6.914,0.017,9.545c1.317,1.313,3.042,1.969,4.765,1.969C232.129,209.309,233.86,208.647,235.18,207.323z"></path> <path d="M407.824,284.613c1.543-0.538,3.017-1.305,4.363-2.307l6.726-5.009c5.414-4.032,7.788-11.099,5.905-17.584l-1.992-6.854 c-1.149-3.952-3.711-7.253-7.131-9.339c-1.141-0.696-2.376-1.256-3.687-1.661c-0.646-0.2-1.297-0.357-1.951-0.474 c-0.347-0.063-0.694-0.083-1.043-0.123c-0.305-0.034-0.608-0.087-0.913-0.104c-0.487-0.027-0.973-0.011-1.458,0.006 c-0.161,0.006-0.323-0.006-0.483,0.005c-0.583,0.037-1.16,0.117-1.734,0.216c-0.059,0.01-0.117,0.013-0.176,0.023 c-2.537,0.469-4.951,1.553-7.049,3.192l-2.492-9.386l-12.519-47.153l5.834-5.485c0.052-0.049,0.105-0.101,0.156-0.152 c4.985-5,48.667-49.695,47.34-78.759c-0.316-6.931-3.141-12.811-8.164-17.006c-28.035-23.403-80.891,29.619-87.29,36.236 l-17.125,16.472l-58.892-17.626c0.4-0.432,0.77-0.881,1.109-1.351c0.005-0.006,0.009-0.012,0.013-0.018 c0.331-0.458,0.633-0.929,0.904-1.417c0.018-0.031,0.033-0.063,0.05-0.094c0.254-0.464,0.483-0.936,0.683-1.422 c0.031-0.075,0.056-0.151,0.086-0.226c0.175-0.449,0.334-0.902,0.462-1.367c0.038-0.138,0.064-0.278,0.099-0.417 c0.101-0.413,0.196-0.827,0.259-1.249c0.033-0.216,0.044-0.437,0.067-0.655c0.036-0.357,0.079-0.712,0.089-1.074 c0.009-0.323-0.014-0.648-0.027-0.974c-0.012-0.268-0.005-0.535-0.032-0.804c-0.058-0.603-0.151-1.207-0.287-1.81 c-1.131-5.014-4.728-8.945-9.623-10.515l-10.164-3.26c-5.09-1.631-10.621-0.323-14.434,3.415l-7.627,7.468c0,0-0.001,0-0.001,0.001 c-1.07,1.048-1.927,2.235-2.608,3.5l-66.119-19.79c-2.101-0.628-4.384-0.197-6.11,1.164l-27.862,21.938 c-1.781,1.402-2.74,3.604-2.551,5.863c0.187,2.258,1.496,4.272,3.484,5.36l58.86,32.222l23.911,13.09c0.001,0,0.001,0,0.002,0.001 l13.296,7.278l40.947,22.416l-57.664,55.463l-109.907-2.438l-6.064-0.135c-0.052-0.002-0.102-0.002-0.151-0.002 c-0.115,0-0.225,0.024-0.339,0.03c-0.464,0.019-0.914,0.086-1.353,0.198c-0.017,0.004-0.033,0.008-0.051,0.013 c-0.413,0.11-0.811,0.255-1.19,0.44c-0.033,0.016-0.067,0.028-0.101,0.045c-0.375,0.191-0.732,0.411-1.065,0.668 c-0.021,0.016-0.043,0.027-0.063,0.043c-0.352,0.277-0.679,0.587-0.971,0.931l0,0c0,0,0,0,0,0.001 c-0.045,0.052-0.079,0.114-0.122,0.168c-0.196,0.246-0.388,0.496-0.549,0.769c-0.1,0.167-0.17,0.352-0.255,0.528 c-0.001,0.002-0.003,0.004-0.003,0.006c-0.002,0.002-0.003,0.004-0.004,0.007c-0.083,0.174-0.181,0.339-0.25,0.521 c0,0.001,0,0.001,0,0.001l0,0c-0.141,0.373-0.25,0.763-0.324,1.167l-3.938,21.542c-0.592,3.241,1.243,6.438,4.341,7.561 l52.545,19.033c0.001,0,0.002,0,0.003,0.001l47.346,17.149l21.565,99.56c0.578,2.665,2.702,4.722,5.384,5.212l20.003,3.657 c0.403,0.072,0.81,0.109,1.214,0.109c1.427,0,2.828-0.452,3.995-1.31c1.497-1.1,2.476-2.767,2.704-4.61l13.965-112.645 l70.269-66.067l71.359,140.64c1.025,2.021,2.998,3.392,5.249,3.651c0.258,0.029,0.515,0.044,0.771,0.044 c1.98,0,3.879-0.873,5.17-2.41l22.799-27.162c1.414-1.684,1.919-3.948,1.355-6.072L407.824,284.613z M196.893,125.127 l-16.64,14.336l-40.901-22.391l17.083-13.451l48.551,14.532L196.893,125.127z M405.45,255.264c0.125-0.103,0.251-0.19,0.376-0.265 c0.501-0.298,0.995-0.382,1.413-0.372c0.104,0.003,0.204,0.012,0.298,0.023c0.188,0.025,0.353,0.064,0.485,0.106 c0.399,0.124,1.03,0.414,1.474,1.077c0.148,0.221,0.275,0.482,0.365,0.793l1.992,6.854c0.32,1.102-0.083,2.305-1.004,2.99 l-6.548,4.875l-2.162-8.143l-1.136-4.28L405.45,255.264z M242.75,108.148c0.227-0.223,0.557-0.302,0.862-0.202l10.165,3.26 c0.127,0.041,0.469,0.15,0.577,0.629c0.108,0.48-0.153,0.725-0.252,0.817l-4.933,4.634l-12.064-3.611L242.75,108.148z M247.551,176.305l-25.6-14.014l22.836-18.651l12.161-9.933l54.819,16.407l-40.646,39.094L247.551,176.305z M238.603,304.536 c-1.147,1.079-1.882,2.525-2.075,4.088l-6.109,49.277l-10.381,2.248l-16.547,3.584l-10.291-47.51 c-0.491-2.269-2.114-4.126-4.298-4.917l-44.439-16.098l10.608-28.294l50.697,1.124c1.781,0.054,3.533-0.64,4.829-1.884 l90.551-87.095l28.313-27.232c0.001-0.001,0.003-0.003,0.005-0.004l20.049-19.284c0.061-0.058,0.121-0.118,0.179-0.178 c16.207-16.799,54.396-47.54,69.013-35.338c2.125,1.774,3.184,4.08,3.328,7.255c0.425,9.252-6.947,24.319-20.758,42.426 c-10.646,13.956-21.608,25.129-22.587,26.12l-7.81,7.343h-0.001c-0.35,0.232-0.687,0.486-0.993,0.785l-4.113,4.017L238.603,304.536 z M350.86,277.831l-20.164-39.741l40.347-39.4l13.607,51.25l-14.323,11.822L350.86,277.831z M398.67,372.057l-25.358-49.978 l24.682-21.882l14.656,55.204L398.67,372.057z"></path> </g> </g></svg>
              case 'Visa':
                return tabActive === "Visa" ? <SolidTicketIcon /> : <TicketIcon color="black" />
              default:
                return null;
            }
          };

          const active = tab === tabActive;
          return (
            <li
              onClick={() => {
                setTabActive(tab)
                if (tab === "Experiences") {
                  router.push("/")
                } else {
                  router.push(`/${tab.toLowerCase()}` as Route)
                }
              }}
              className={`flex-shrink-0 flex h-fit items-center px-4 py-3 cursor-pointer text-sm lg:text-base font-medium ${active
                ? "text-white bg-orange-500 hover:bg-orange-700 rounded-xl"
                : "text-black bg-gray-200 hover:bg-gray-300 dark:hover:text-neutral-200 rounded-xl"
                } `}
              key={tab}
            >
              <span className="block w-8 h-8  mr-2">
                {renderIcons(tab)}
              </span>
              <span>{tab}</span>
            </li>
          );
        })}
      </ul>
    );
  };



  const renderForm = () => {
    switch (tabActive) {
      case "Stays":
        return <StaySearchForm />;
      case "Experiences":
        return <ExperiencesSearchForm />;
      case "Visa":
        // router.push("/visa" as Route);
        return <RentalCarSearchForm />;
      case "Flights":
        // router.push("/flights" as Route);
        return <FlightSearchForm />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 z-10 ${className} items-center`}
    >
      {/* <div className="w-full flex justify-center -mt-10 mb-[120px]">
      {renderTab()}
      </div>
      {renderForm()} */}

    <div className="w-full ">
      {renderTab()}
      </div>
      <div className="pt-2">
        {renderForm()}
      </div>


    </div>
  );
};

export default HeroSearchForm;
