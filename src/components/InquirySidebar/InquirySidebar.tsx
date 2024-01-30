"use client";
import { RootState } from "@/redux/store";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import BtnLoader from "@/shared/Loader/BtnLoader";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function InquirySidebar() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsappNo, setWhatsappNo] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { countries, globalData } = useSelector((state: RootState) => state.initials);

  const [loading, setLoading] = useState(false);

  const submitInquiry = async () => {
    setError("");
    setLoading(true);
    const body = {
      name: name,
      email: email,
      whatsapp: whatsappNo,
      nationality: country,
      message: message,
    };
    try {
      const inquiryDetails = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/visa/enquiry/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      return inquiryDetails.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function postInquiry() {
    try {
      const response = await submitInquiry();
      setError(response?.error);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="nc-PropertyCardH border rounded-lg p-5">
        <div className="mb-5">
          <span className="text-3xl border-b font-semibold">Customer Support</span>
        </div>

        <form>
          <label className="label px-2">Name</label>
          <div className="p-2 rounded-xl border mb-2">
            <input
              className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
              value={name}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </div>
          <label className="label px-2">Email</label>
          <div className="p-2 rounded-xl border mb-2">
            <input
              className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate`}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
          </div>
          <label className="label px-2">Whatsapp Number</label>
          <div className="p-2 rounded-xl border mb-2">
            <input
              className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
              value={whatsappNo}
              onChange={(e) => {
                setWhatsappNo(e.currentTarget.value);
              }}
            />
          </div>
          <label className="label px-2">Nationality</label>
          <div className="p-2 rounded-xl mb-2">
            <label className="block">
              <select
                onClick={(e: any) => setCountry(e?.target?.value)}
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>countries</option>
                {countries?.map((country, index) => {
                  return (
                    <option value={country?._id} key={index}>
                      {country?.countryName?.toLocaleUpperCase()}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <label className="label px-2">Message</label>
          <div className="p-2 rounded-xl border  mb-2">
            <textarea
              className={`block w-full overflow-y-auto h-12 bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg placeholder-neutral-300 dark:placeholder-neutral-200 truncate capitalize`}
              value={message}
              onChange={(e) => {
                setMessage(e.currentTarget.value);
              }}
            />
          </div>
        </form>
        <ButtonPrimary onClick={postInquiry} className="mt-1 w-full rounded-lg">
          {loading ? <BtnLoader /> : "Submit Inquiry"}
        </ButtonPrimary>

        {error !== "" && (
          <p className="text-red-700 mt-1">{error}</p>
        )}
      </div>
      <div className="nc-PropertyCardH border  border-green-600 rounded-xl p-4 mt-4 ">
        <a
          className={`cursor-pointer w-full h-full`}
          href={`https://wa.me/${globalData?.home?.phoneNumber2}`}
          target="_blank"
          rel="noopener noreferrer"
          title={"WhatsApp"}
        >
          <div className="flex gap-3 items-center justify-center text-green-600">
            <i className="lab la-whatsapp text-3xl"></i>
            <p className="text-xl">Whatsapp</p>
          </div>
        </a>
      </div>
    </>
  );
}

export default InquirySidebar;
