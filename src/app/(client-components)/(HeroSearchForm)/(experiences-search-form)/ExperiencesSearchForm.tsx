import React, { FC, useEffect, useState } from "react";
import LocationInput from "./LocationInput";
import GuestsInput from "../GuestsInput";
import { Route } from "next";

export interface ExperiencesSearchFormProps {
  closeModal?: () => void
}


const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({ closeModal }) => {
  const [query, setQuery] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [response, setResponse] = useState({})


  useEffect(() => {
    const findAttractionQuery = async (queries: string) => {
      try {
        const query = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/search/list?search=${queries}`, { cache: 'no-store' })
        setResponse(await query.json())
  
      } catch (error) {
        console.log(error);
 
      }
    }

    findAttractionQuery(query)

  }, [query])


  const renderForm = () => {
    return (
      <form className="w-full max-w-[600px] relative -mb-10 flex flex-col md:flex-row rounded-xl md:rounded-xl md:shadow-xl dark:shadow-2xl md:bg-white dark:bg-neutral-800 ">
        <LocationInput closeModal={closeModal} data={response} setQuery={setQuery} setDestination={setDestination} className="flex-[1.5]" />
        {/* <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div> */}
        {/* <ExperiencesDateSingleInput className="flex-1" /> */}
        {/* <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div> */}
        {/* <GuestsInput
          className="flex-1"
          buttonSubmitHref={destination ? `/${destination}/${query}` as Route : `/${query}` as Route}
        /> */}
      </form>
    );
  };

  return renderForm();
};

export default ExperiencesSearchForm;
