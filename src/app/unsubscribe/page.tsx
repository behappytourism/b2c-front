"use client";

import ButtonPrimary from "@/shared/ButtonPrimary";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [check, setCheck] = useState<string | null>(null);
  const [direct, setDirect] = useState<string | null>(null);
  const [subscribeMessage, setSubscribeMessage] = useState<{ message?: string }>({});

  // Function to get query parameter values
  const getQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return {
      check: queryParams.get("check"),
      direct: queryParams.get("direct"),
    };
  };

    const unsubscribe = async (check: string, direct: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/email/subscription/unsubscribe`,
        {
          method: "POST",
          body: JSON.stringify({ check, direct }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function unsubscribeProcess() {
    try {
      if (check && direct) {
        const response = await unsubscribe(check, direct);
        console.log("api worked");

        // Handle the response if needed
      }
    } catch (error) {
      console.error(error);
    }
  }

  const subscribe = async (check: string, direct: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/email/subscription/subscribe`,
        {
          method: "POST",
          body: JSON.stringify({ check, direct }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function subscribeProcess() {
    try {
      if (check && direct) {
        const response = await subscribe(check, direct);
        console.log("api worked");
        setSubscribeMessage(response);
        // Handle the response if needed
      }
    } catch (error) {
      console.error(error);
    }
  }

//   useEffect(() => {
//     const emailFromUrl = getEmailFromUrl();
//     setEmail(emailFromUrl);
//     {
//       email !== "" && unsubscribeProcess();
//     }
//   }, []);

//   useEffect(() => {
//     {
//       email !== "" && unsubscribeProcess();
//     }
//   }, [email]);

  useEffect(() => {
    const { check, direct } = getQueryParams();
    setCheck(check);
    setDirect(direct);
    console.log(check, "check id"); 
    console.log(direct, "direct id");

    if (check && direct) {
     unsubscribeProcess()
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="w-full flex justify-center">
      <div className="md:max-w-[800px] flex flex-col justify-center text-center items-center md:py-40 py-10">
        <div className="md:border px-4 md:py-10 md:px-28 md:rounded-xl md:shadow-md md:border-gray-100">
          {subscribeMessage?.message === "" && (
            <div>
              <h1 className="text-4xl font-semibold">You're Unsubscribed</h1>
              <p className="mt-5 text-sm">
                We're sorry to lose you as a subscriber. We value your presence
                and would love to stay in touch. If you’d like to continue
                receiving our updates, please resubscribe. Your engagement means
                a lot to us!
              </p>
            </div>
          )}

          {subscribeMessage?.message !== "" && (
            <div>
              <h1 className="text-4xl font-semibold">You're Subscribed</h1>
              <p className="mt-5 text-sm">{subscribeMessage?.message}</p>
            </div>
          )}

          {subscribeMessage?.message === "" && (
            <div className="flex gap-5 mt-5 w-full justify-center items-center">
              <ButtonPrimary
                className="md:w-fit w-full"
                onClick={() => subscribeProcess()}
              >
                Oops, I want back in!
              </ButtonPrimary>
            </div>
          )}

          {subscribeMessage?.message !== "" && (
            <div className="flex gap-5 mt-5 w-full justify-center items-center">
              <ButtonPrimary
                className="md:w-fit w-full"
               onClick={() => unsubscribeProcess()}
              >
                Unsubscribed
              </ButtonPrimary>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
