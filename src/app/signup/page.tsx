"use client";
import React, { FC, useEffect, useState } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { setUser } from "@/redux/features/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchAffiliateUser } from "@/redux/features/affiliatesSlice";

export interface PageSignUpProps {}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageSignUp: FC<PageSignUpProps> = ({}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { countries } = useSelector((state: RootState) => state.initials);
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [paxphoneCode, setPaxPhoneCode] = useState<string>("");

  useEffect(() => {
    const filteredCountries = countries?.filter(
      (countryItem) => countryItem?._id === country
    );

    const filteredPaxPhoneCode = filteredCountries[0]?.phonecode;

    setPaxPhoneCode(filteredPaxPhoneCode || "");
  }, [countries, country]);

  const signUp = async () => {
    const payload = {
      name: name,
      country: country,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/signup`,
        {
          method: "POST",
          body: JSON.stringify(payload),
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

  async function signupProcess() {
    try {
      const response = await signUp();
      dispatch(setUser(response));
      {
        response?.jwtToken && router.push("/");
      }
      setError(response?.error);
    } catch (error) {
      console.error(error);
    }
  }

  const googleSignIn = async () => {
    const payload = {
      email: session?.user?.email,
      name: session?.user?.name,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/emailLogin`,
        {
          method: "POST",
          body: JSON.stringify(payload),
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

  async function googleProcess() {
    try {
      const response = await googleSignIn();
      dispatch(setUser(response));
      dispatch(fetchAffiliateUser() as any);
      {
        response?.jwtToken && router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      session && googleProcess();
    }
  }, [session]);

  return (
    <div className={`nc-PageSignUp  `}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          <div className="grid gap-3">
            <a
              onClick={() =>
                signIn("google", {
                  callbackUrl:
                    "https://mytravellerschoice.com/api/auth/callback/google",
                })
              }
              className="flex w-full cursor-pointer rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
            >
              <Image
                className="flex-shrink-0"
                src={loginSocials[2].icon}
                alt={loginSocials[2].name}
              />
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                {loginSocials[2].name}
              </h3>
            </a>
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Name
              </span>
              <Input
                type="text"
                placeholder="enter your name"
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <div className="">
              <label className="block">
                {/* <span className="text-neutral-800 dark:text-neutral-200">
                Phone Code
              </span>
              <Input
                type="number"
               // onChange={(e) => setCountry(e.target.value)}
                placeholder="exp@91"
                className="mt-1"
              /> */}
                <span className="text-neutral-800 dark:text-neutral-200">
                  Select Country
                </span>
                <select
                  onClick={(e: any) => setCountry(e?.target?.value)}
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              <label className="block w-full mt-6 md:mt-6">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Phone Number
                </span>
                <div className="flex items-center border rounded-2xl mt-1.5">
                  <p className="border-r pl-2 pr-1 text-sm">{paxphoneCode}</p>
                  <Input
                    type="number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="enter your phone number"
                    className="no-spinner border-none w-fit bg-transparent"
                  />
                </div>
              </label>
            </div>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <span className="text-[9px]">
                Password must be strong. At least one alphabet. At least one
                digit. At least one special character.
              </span>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1"
              />
            </label>
          </form>

          <ButtonPrimary className="md:w-fit w-full" onClick={signupProcess}>
            Continue
          </ButtonPrimary>

          {error !== "" && (
            <p className="text-[13px] mt-3 text-red-600">{error}</p>
          )}

          {/* ==== */}
          <span className="md:block hidden text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
