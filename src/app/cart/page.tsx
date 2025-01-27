"use client";

import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import { BaseTypeEnum } from "@/data/attraction/types";
import {
  handleChangeCart,
  handleEmptyCart,
  handleRemoveFromCart,
  storeAttractionActivity,
} from "@/redux/features/attractionSlice";
import { AppDispatch, RootState } from "@/redux/store";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import BtnLoader from "@/shared/Loader/BtnLoader";
import Select from "@/shared/Select";
import ErrorModal from "@/shared/Status/ErrorModal";
import Textarea from "@/shared/Textarea";
import Toggle from "@/shared/Toggle";
import priceConversion from "@/utils/priceConversion";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  handleEmptyTransferCart,
  handleRemoveFromTransferCart,
  storeTransferResults,
} from "@/redux/features/transferSlice";
import Link from "next/link";
import { Route } from "next";
import Checkbox from "@/shared/Checkbox";

interface vehicleType {
  name: string;
  count: number;
  price: number;
  vehicleType: string;
}

interface walletType {
  balance: number
}

const Cart = () => {
  const thisPathname = usePathname();
  const { jwtToken } = useSelector((state: RootState) => state.users);
  const route = useRouter();
  const [leadPaxDes, setLeadPaxDes] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [pax, setPax] = useState({
    gender: "male",
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    phone: "",
    special_request_text: "",
  });
  const [paxphoneCode, setPaxPhoneCode] = useState<string>("");
  const [paxCountryCode, setPaxCountryCode] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState({balance: 0})
  const [walletApply, setWalletApply] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    const calculateRemainingBalance = () => {
      if (walletBalance?.balance < grandTotal + totalTransferPrice) {
        setRemainingBalance(0);
      } else {
        setRemainingBalance(walletBalance.balance - (grandTotal + totalTransferPrice));
      }
    };
  
    calculateRemainingBalance();
  }, [walletApply, walletBalance]);

  const getWalletBalance = async () => {
    try {  
      const walletBalance = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wallet-balance`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 1 },
        }
      );
  
      const data = await walletBalance.json();
      setWalletBalance(data || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWalletBalance();
  },[])

  // Making breadcrums data.
  const parts = thisPathname?.split("/").filter((part) => part !== "");
  let link = "";
  const breadcrum: BreadcrumbsList[] = parts.map((item) => {
    link += `/${item}`;
    return {
      name: item,
      link: link,
      classNames: "",
    };
  });

  const { countries, selectedCurrency } = useSelector(
    (state: RootState) => state.initials
  );

  const { cart } = useSelector((state: RootState) => state.attraction);
  
  const { transfer, transferCart } = useSelector(
    (state: RootState) => state.transfer
  );

  const [transferSearching, setTransferSearching] = useState<Array<boolean>>(
    new Array(transferCart.length).fill(false)
  );

  const [briefPayments, setBriefPayments] = useState(cart.map(() => true));
  const [briefTransferStates, setBriefTransferStates] = useState<boolean[]>(
    Array(transferCart.length).fill(true)
  );

  const toggleBriefTransfer = (index: number) => {
    const newStates = [...briefTransferStates];
    newStates[index] = !newStates[index];
    setBriefTransferStates(newStates);
  };

  const [finalPayment, setFinalPayment] = useState(true);

  const toggleBriefPayment = (index: number) => {
    const updatedBriefPayments = [...briefPayments];
    updatedBriefPayments[index] = !updatedBriefPayments[index];
    setBriefPayments(updatedBriefPayments);
  };  

  useEffect(() => {
    const filteredCountries = countries?.filter(
      (country) => country?._id === pax?.country
    );

    // Extract phonecode from the filtered countries
    const filteredPaxPhoneCode = filteredCountries[0]?.phonecode;
    const filteredCountryCode = filteredCountries[0]?.isocode;

    // Set the flattened phonecode array to paxphoneCode
    setPaxPhoneCode(filteredPaxPhoneCode || "");
    setPaxCountryCode(filteredCountryCode || "");
  }, [countries, pax]);

  // Setting value of data to states.
  const onChangeHandler = (e: {
    target: { name: string; value: string | number };
  }) => {
    setPax((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  

  const activity = cart.map((item) => {
    const formattedDate = item?.date ? new Date(item.date).toISOString().split('T')[0] : '';
    return {
      activity: item?._id,
      date: formattedDate, 
      adultsCount: item?.adultCount,
      childrenCount: item?.childCount,
      infantCount: item?.infantCount,
      hoursCount:
        item?.base === BaseTypeEnum.hourly ? item?.hourCount : undefined || "",
      transferType: item?.transferType,
      slot: item?.slot,
      isPromoAdded: item?.isPromoAdded,
    };
  });

  const transferArray = transferCart.flatMap((item, index) =>
    item.trips.map((trip, tripIndex) => ({
      dropOffLocation: trip?.transferTo?._id,
      dropOffSuggestionType: trip?.transferTo?.dropOffSuggestionType,
      pickupDate: trip?.date,
      noOfAdults: trip?.noOfAdults,
      noOfChildrens: trip?.noOfChildrens,
      pickupLocation: trip?.transferFrom?._id,
      pickupSuggestionType: trip?.transferFrom?.pickupSuggestionType,
      pickupTime: trip?.time,
      returnDate: trip?.returnDate || "",
      returnTime: trip?.returnTime || "",
      transferType: trip?.transferType,
      selectedVehicleTypes:
        trip?.vehicles?.flatMap((vehi) =>
          vehi?.map((vehicle: any) => ({
            vehicle: vehicle?.vehicle,
            count: vehicle?.count,
          }))
        ) || [],
      selectedReturnVehicleTypes:
        trip?.returnVehicle?.flatMap((vehi) =>
          vehi.map((vehicle: any) => ({
            vehicle: vehicle?.vehicle,
            count: vehicle?.count,
          }))
        ) || [],
    }))
  );

  // Handling submit.
  const submitHandler = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      setError("");

      setIsLoading(true);

      // if (cart.length || transfer.length === 0) {
      //   setError("Your cart is empty.");
      //   setIsLoading(false);
      //   return;
      // }

      let headers = {};
      if (jwtToken?.length && jwtToken !== null && jwtToken !== undefined) {
        headers = {
          "Content-Type": "application/json",
        };
      } else {
        headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/orders/create`,
        {
          method: "POST",
          body: JSON.stringify({
            selectedActivities: activity,
            selectedJourneys: transferArray,
            country: pax.country,
            name: pax.firstname + " " + pax.lastname,
            email: pax.email,
            phoneNumber: pax.phone,
            paymentMethod: walletApply ? "wallet" : "ccavenue",
            countryCode: paxCountryCode,
          }),
          headers: headers,
        }
      );

      if (!response.ok) {
        const res = await response.json();
        console.log(res);

        setError(res?.error || "Something went wrong.!");
        setIsLoading(false);
        return;
      }

      const order = await response.text();

      const winUrl = URL.createObjectURL(
        new Blob([order], { type: "text/html" })
      );

      // window.open(winUrl, "win");

      if (typeof window !== undefined) {
        window.location.replace(winUrl);
      }

      dispatch(handleEmptyCart(""));
      dispatch(handleEmptyTransferCart(""));

      setIsLoading(false);
    } catch (error: any) {
      setError(error?.response?.data?.error || "Something went wrong!");
      console.log(error);

      setIsLoading(false);
    }
  };

  // handle Remove each activity from cart.
  const handleRemoveActivityFromCart = (id: string) => {
    dispatch(handleRemoveFromCart(id));
  };

  const handleRemoveTransferFromCart = (index: number) => {
    dispatch(handleRemoveFromTransferCart(index));
  };

  // Handle change data of cart.
  const handleChangeData = (index: number, keyName: string, value: any) => {
    dispatch(
      handleChangeCart({
        index: index,
        keyName: keyName,
        value: value,
      })
    );
  };

  // calculate Grand Total.
  const grandTotal: number = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (item.isPromoAdded) {
        return acc + item.priceWithoutPromoGrandTotal - item?.appliedPromoAmount;
      } else {
        return acc + item.priceWithoutPromoGrandTotal;
      }
    }, 0);
  }, [cart]);

  const totalTransferPrice: number = useMemo(() => {
    return transferCart.reduce((total, item) => {
      // Calculate total price for vehicles in the 'vehicles' array

      const vehiclesPrice = item.trips.reduce((tripSum, trip) => {
        const vehicleTotal = trip.vehicles.reduce((vehicleSum, vehicle) => {
          const totalForTrip = vehicle.reduce((acc: any, vehi: any) => {
            return acc + (vehi?.price || 0);
          }, 0);
          return vehicleSum + totalForTrip;
        }, 0);
        return tripSum + vehicleTotal;
      }, 0);

      // Calculate total price for vehicles in the 'returnVehicle' array
      const returnVehiclesPrice = item.trips.reduce((tripSum, trip) => {
        const returnVehicleTotal = trip.returnVehicle.reduce(
          (vehicleSum, vehicle) => {
            const totalForReturn = vehicle.reduce((acc: any, vehi: any) => {
              return acc + (vehi?.price || 0);
            }, 0);
            return vehicleSum + totalForReturn;
          },
          0
        );
        return tripSum + returnVehicleTotal;
      }, 0);

      return total + vehiclesPrice + returnVehiclesPrice;
    }, 0);
  }, [transferCart]);

  const closeModal = () => {
    setError("");
  };

  const transferSearch = async (trip: any, index: number) => {
    // Set the loading state for the specific trip
    const updatedTransferSearching = [...transferSearching];
    updatedTransferSearching[index] = true;
    setTransferSearching(updatedTransferSearching);
    const body = {
      dropOffLocation: trip?.transferTo?._id,
      dropOffSuggestionType: trip?.transferTo?.dropOffSuggestionType,
      noOfAdults: trip?.noOfAdults,
      noOfChildrens: trip?.noOfChildrens,
      pickupDate: trip?.pickupDate,
      pickupLocation: trip?.transferFrom?._id,
      pickupSuggestionType: trip?.transferFrom?.pickupSuggestionType,
      pickupTime: trip?.pickupTime,
      returnDate: trip?.returnDate,
      returnTime: trip?.returnTime,
      transferType: trip?.transferType,
    };

    let headers = {};

    headers = {
      "Content-Type": "application/json",
    };

    try {
      const transferResult = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/transfer/search`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
      return transferResult.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function transferResults(trip: any, index: number) {
    try {
      const response = await transferSearch(trip, index);

      {
        response && dispatch(storeTransferResults([response]));
      }

      {
        response && route.push("/transfer/list");
      }

      // Reset the loading state for the specific trip
      const updatedTransferSearching = [...transferSearching];
      updatedTransferSearching[index] = false;
      setTransferSearching(updatedTransferSearching);
    } catch (error) {
      console.error(error);
    }
  }

  const renderDetailsCollection = () => {
    return (
      <div className="border-b pb-10">
        <div className="flex gap-3 text-center items-center mb-5">
          <h2 className="md:text-2xl text-2xl border-b pb-3 font-semibold">
            Lead Passenger Details
          </h2>
          <p
            className="cursor-pointer"
            onClick={() => setLeadPaxDes(!leadPaxDes)}
          >
            ?
          </p>
        </div>
        {leadPaxDes === true && (
          <span className="absolute text-sm -mt-2 bg-primary-500 font-thin px-4 text-white rounded-lg p-1 dark:text-neutral-400">
            Provide the details of the lead passenger to book the attraction
          </span>
        )}
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}

        <div className="">
          <div className="flex gap-2 mb-5">
            <div className="min-w-[80px]">
              {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">Mr/Mrs</p> */}
              <Select
                name="gender"
                value={pax.gender}
                onChange={onChangeHandler}
                required
              >
                <option value={"male"}>Mr.</option>
                <option value={"female"}>Mrs.</option>
                <option value={"other"}>Ms.</option>
              </Select>
            </div>
            <div className="flex gap-2">
              <div className="w-full">
                {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">
              Firstname
            </p> */}
                <Input
                  type="text"
                  name="firstname"
                  placeholder="first name"
                  value={pax.firstname}
                  onChange={onChangeHandler}
                  required
                />
              </div>
              <div className="w-full">
                {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">
              Lastname
            </p> */}
                <Input
                  type="text"
                  name="lastname"
                  value={pax.lastname}
                  placeholder="last name"
                  onChange={onChangeHandler}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">Email</p> */}
            <Input
              type="email"
              name="email"
              value={pax.email}
              onChange={onChangeHandler}
              required
              placeholder="email"
            />
          </div>
          <div className="flex gap-2 mb-5">
            <div className="w-fit">
              {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">
              Country
            </p> */}
              <Select
                name="country"
                value={pax.country}
                onChange={onChangeHandler}
                required
                placeholder="country"
                className="capitalize"
              >
                <option>country</option>
                {countries?.map((item) => (
                  <option
                    className="capitalize"
                    key={item._id}
                    value={item._id}
                  >
                    {item.countryName}{" "}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full">
              {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">
              Phone Number
            </p> */}
              <div className="flex items-center border rounded-xl">
                <p className="border-r pl-1 pr-1 text-[14px]">{paxphoneCode}</p>
                <Input
                  type="number"
                  name="phone"
                  value={pax.phone}
                  placeholder="phone number"
                  onChange={onChangeHandler}
                  min={0}
                  maxLength={10}
                  required
                  className="no-spinner border-none w-fit bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            {/* <p className="text-neutral-500 dark:text-neutral-400 p-2">
              Special Request
            </p> */}
            <Textarea
              placeholder="Special Request"
              name="special_request_text"
              value={pax.special_request_text}
              onChange={onChangeHandler}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentSection = () => {
    return (
      <div className="border-b p-5">
        <ErrorModal
          title="Something went wrong"
          text={error}
          isOpen={error.length > 0}
          closeModal={closeModal}
        />
        <div>
          <h2 className="text-2xl md:text-3xl border-b pb-3 w-fit font-semibold mb-5">
            Pay
          </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            By clicking Pay Now you agree that you have read and understand our
            Terms and Conditions.
          </span>
        </div>

        <div className="">
          <button
            className="w-full mt-5 bg-orange-500 hover:bg-orange-700 text-white p-3 rounded-lg font-semibold"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <BtnLoader /> : "Pay Now"}{" "}
          </button>
        </div>
      </div>
    );
  };

  const renderTransfer = () => {
    return (
      <div>
        <h1 className={`text-3xl font-semibold pb-2 border-b w-fit`}>
          Transfer
        </h1>

        {transferCart?.map((item, index) => (
          <>
            {item?.trips?.map((trip, tripIndex) => (
              <div className="border rounded-lg mt-5 p-3">
                <div
                  className={`md:flex items-center md:justify-between ${
                    briefTransferStates[index] === false ? "" : "border-b"
                  } ${briefTransferStates[index] === false ? "" : "mb-3"}`}
                >
                  <div className="md:hidden block">
                    <div className="flex justify-end gap-3">
                      <PencilSquareIcon
                        onClick={() => transferResults(trip, index)}
                        height={20}
                        width={20}
                      />
                      <i
                        onClick={() => handleRemoveTransferFromCart(index)}
                        className="las la-times-circle text-xl text-red-600 cursor-pointer"
                      ></i>
                      {briefTransferStates[index] === false && (
                        <p className="cursor-pointer">
                          <ChevronDownIcon
                            onClick={() => toggleBriefTransfer(index)}
                            height={20}
                            width={20}
                          />
                        </p>
                      )}
                      {briefTransferStates[index] === true && (
                        <p className="cursor-pointer">
                          <ChevronUpIcon
                            onClick={() => toggleBriefTransfer(index)}
                            height={20}
                            width={20}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="md:flex items-center space-x-3 mb-3 md:mb-0">
                    <p className="text-xl p-3 font-semibold">
                      {trip?.transferFrom?.airportName}
                    </p>
                    <div className="hidden md:block">
                      <ArrowRightIcon height={24} width={24} />
                    </div>
                    <div className="md:hidden flex justify-center">
                      <ArrowDownIcon height={24} width={24} />
                    </div>
                    <p className="text-xl md:p-3 font-semibold">
                      {trip?.transferTo?.areaName}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <div className="flex gap-3">
                      {transferSearching[index] === false && (
                        <PencilSquareIcon
                          className="cursor-pointer"
                          onClick={() => transferResults(trip, index)}
                          height={20}
                          width={20}
                        />
                      )}

                      {transferSearching[index] === true && (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          ></path>
                        </svg>
                      )}
                      <i
                        onClick={() => handleRemoveTransferFromCart(index)}
                        className="las la-times-circle text-xl text-red-600 cursor-pointer"
                      ></i>
                      {briefTransferStates[index] === false && (
                        <p className="cursor-pointer">
                          <ChevronDownIcon
                            onClick={() => toggleBriefTransfer(index)}
                            height={20}
                            width={20}
                          />
                        </p>
                      )}
                      {briefTransferStates[index] === true && (
                        <p className="cursor-pointer">
                          <ChevronUpIcon
                            onClick={() => toggleBriefTransfer(index)}
                            height={20}
                            width={20}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {briefTransferStates[index] === true && (
                  <div className="">
                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <span>Date</span>
                      <span className="capitalize">{trip.date}</span>
                    </div>

                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <span>Time</span>
                      <span className="capitalize">{trip?.time}</span>
                    </div>

                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <p className="text-lg border-b font-semibold">
                        Vehicle's
                      </p>
                    </div>
                    {trip?.vehicles?.map((vehicle: any, index) => (
                      <>
                        {vehicle?.map((vehi: any, vehiIndex: number) => (
                          <div className="border p-2 rounded-lg mt-3">
                            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                              <span>Name</span>
                              <span className="capitalize">{vehi?.name}</span>
                            </div>
                            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                              <span>Count</span>
                              <span className="capitalize">{vehi?.count}</span>
                            </div>
                            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                              <span>Price</span>
                              <span className="capitalize">
                                {priceConversion(
                                  vehi?.price,
                                  selectedCurrency,
                                  true
                                )}
                              </span>
                            </div>
                            {vehi?.vehicleType && (
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Vehicle Type</span>
                                <span className="capitalize">
                                  {vehi?.vehicleType}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    ))}

                    {trip?.transferType === "return" && (
                      <div className="mt-10">
                        <div className="md:flex border-b  items-center space-x-3 mb-3 md:mb-0">
                          <p className="text-xl p-3 font-semibold">
                            {trip?.transferTo?.areaName}
                          </p>
                          <div className="hidden md:block">
                            <ArrowRightIcon height={24} width={24} />
                          </div>
                          <div className="md:hidden flex justify-center">
                            <ArrowDownIcon height={24} width={24} />
                          </div>
                          <p className="text-xl md:p-3 font-semibold">
                            {trip?.transferFrom?.airportName}
                          </p>
                        </div>

                        <div className="flex justify-between mt-3 text-neutral-6000 dark:text-neutral-300">
                          <span>Date</span>
                          <span className="capitalize">{trip.returnDate}</span>
                        </div>

                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>Time</span>
                          <span className="capitalize">{trip?.returnTime}</span>
                        </div>

                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <p className="text-lg border-b font-semibold">
                            Vehicle's
                          </p>
                        </div>
                        {trip?.returnVehicle?.map(
                          (returnVehicle: any, index) => (
                            <>
                              {returnVehicle?.map(
                                (rtnVehi: any, rtnVehiIndex: number) => (
                                  <div className="border p-2 rounded-lg mt-3">
                                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                      <span>Name</span>
                                      <span className="capitalize">
                                        {rtnVehi?.name}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                      <span>Count</span>
                                      <span className="capitalize">
                                        {rtnVehi?.count}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                      <span>Price</span>
                                      <span className="capitalize">
                                        {priceConversion(
                                          rtnVehi?.price,
                                          selectedCurrency,
                                          true
                                        )}
                                      </span>
                                    </div>
                                    {rtnVehi?.vehicleType && (
                                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                        <span>Vehicle Type</span>
                                        <span className="capitalize">
                                          {rtnVehi?.vehicleType}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        ))}
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="flex flex-col gap-5 w-full">
        <h1 className="text-3xl font-semibold pb-2 border-b w-fit">Tours</h1>

        {cart.map((item, i) => (
          <div key={item._id} className="rounded-lg border w-full p-3">
            <div className="flex flex-col gap-2 text-sm">
              <div
                className={`md:flex md:justify-between items-center gap-2 ${
                  briefPayments[i] === false ? "" : "border-b"
                }`}
              >
                <div className="gap-3 md:hidden flex justify-end">
                  {/* <PencilSquareIcon height={20} width={20} /> */}
                  <i
                    onClick={() => handleRemoveActivityFromCart(item._id)}
                    className="las la-times-circle text-xl text-red-600 cursor-pointer"
                  ></i>
                  {briefPayments[i] === false && (
                    <p className="cursor-pointer">
                      <ChevronDownIcon
                        onClick={() => toggleBriefPayment(i)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                  {briefPayments[i] === true && (
                    <p className="cursor-pointer">
                      <ChevronUpIcon
                        onClick={() => toggleBriefPayment(i)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                </div>
                <p className="text-xl p-3 font-semibold">{item.name}</p>
                <div className="gap-3 hidden md:flex">
                  <Link href={`/${item?.destination}/${item?.slug}`}>
                    <PencilSquareIcon height={20} width={20} />
                  </Link>
                  <i
                    onClick={() => handleRemoveActivityFromCart(item._id)}
                    className="las la-times-circle text-xl text-red-600 cursor-pointer"
                  ></i>
                  {briefPayments[i] === false && (
                    <p className="cursor-pointer">
                      <ChevronDownIcon
                        onClick={() => toggleBriefPayment(i)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                  {briefPayments[i] === true && (
                    <p className="cursor-pointer">
                      <ChevronUpIcon
                        onClick={() => toggleBriefPayment(i)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                </div>
              </div>
              {briefPayments[i] === true && (
                <div className="">
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Transfer Type</span>
                    <span className="capitalize">
                      {item.transferType + " Transfer"}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Date</span>
                    <span>{format(new Date(item.date), "d MMM, yyyy")}</span>
                  </div>
                  {item.hasOwnProperty("slot") && item.slot ? (
                    <>
                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span>Slot</span>
                        <span>{item.slot.EventName}</span>
                      </div>{" "}
                      <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                        <span>Slot Date</span>
                        <span>
                          {format(
                            new Date(item.slot?.StartDateTime),
                            "d-M-yyyy"
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  {item.base === BaseTypeEnum.hourly ? (
                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <span>Hours</span>
                      <span>{item.hourCount + " Hour"}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                      <span>Pax</span>
                      <span>{`${item.adultCount} Adult`}</span>
                      {item.childCount > 0 ? (
                        <span>{`${item.childCount} Child`}</span>
                      ) : (
                        ""
                      )}
                      {item.infantCount < 0 ? (
                        <span>{`${item.infantCount} Infant`}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Amount Incl. VAT</span>
                    <span>
                      {priceConversion(
                        item.priceWithoutPromoGrandTotal,
                        selectedCurrency,
                        true
                      )}
                    </span>
                  </div>
                  {item.promoCode !== "" && (
                    <div className="p-1 rounded-xl flex justify-between  text-blue-700">
                      <span className="flex gap-1 items-center">
                        <span className="">
                          <Toggle
                            value={item.isPromoAdded}
                            onChange={(e: { target: { checked: boolean } }) =>
                              handleChangeData(
                                i,
                                "isPromoAdded",
                                e.target.checked
                              )
                            }
                          />
                        </span>
                        <span>
                          {item?.isPromoAdded
                            ? "Coupon applied"
                            : "Apply coupon"}{" "}
                        </span>
                      </span>
                      <span className="font-medium">{item.promoCode}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                    <span>Grand Total</span>
                    <span>
                      {item.isPromoAdded
                        ? priceConversion(
                            item.priceWithoutPromoGrandTotal - item?.appliedPromoAmount,
                            selectedCurrency,
                            true
                          )
                        : priceConversion(
                            item.priceWithoutPromoGrandTotal,
                            selectedCurrency,
                            true
                          )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PriceSidebar = () => {
    return (
      <div
        className="rounded-lg border p-3 cursor-pointer mt-5"
      >
        <div
          className={`flex justify-between items-center gap-2 ${
            finalPayment === false ? "" : "border-b"
          }`}
        >
          <p className="font-medium text-lg p-3">Final Payment</p>
          {finalPayment === false && (
            <p>
              <ChevronDownIcon
                onClick={() => setFinalPayment(!finalPayment)}
                height={20}
                width={20}
              />
            </p>
          )}
          {finalPayment === true && (
            <p>
              <ChevronUpIcon
              className="cursor-pointer"
                onClick={() => setFinalPayment(!finalPayment)}
                height={20}
                width={20}
              />
            </p>
          )}
        </div>

        {finalPayment === true && (
          <div>
            {grandTotal > 0 && (
              <div className="flex justify-between pt-3 pb-1">
                <p>Tours Total Amount Incl. VAT</p>
                <p className="font-semibold"> {priceConversion(grandTotal, selectedCurrency, true)}</p>
              </div>
            )}

            {totalTransferPrice > 0 && (
              <div className="flex justify-between pt-1 mb-5">
                <p>Transfer Total Amount Incl. VAT</p>
                <p className="font-semibold">
                  {" "}
                  {priceConversion(totalTransferPrice, selectedCurrency, true)}
                </p>
              </div>
            )}

           {jwtToken && (
             <div className="flex items-center text-center gap-3 my-2 opacity-90">
              <Checkbox onChange={() => setWalletApply(!walletApply)} name="wallet" />
              <div className="w-full flex justify-between">
              <p className="">Apply available wallet balance</p>
              <p className="font-semibold">{priceConversion(walletBalance?.balance - remainingBalance, selectedCurrency, true)}</p>
              </div>
            </div>
            )}

           {walletApply ? (
 <div className="flex justify-between font-bold text-xl dark:bg-neutral-800 bg-gray-200 p-3 rounded-lg">
 <p>Final Amount</p>
 <p>
   {priceConversion(
     grandTotal + totalTransferPrice - (walletBalance?.balance - remainingBalance),
     selectedCurrency,
     true
   )}
 </p>
</div>
           ) : (
            <div className="flex justify-between font-bold text-xl dark:bg-neutral-800 bg-gray-200 p-3 rounded-lg">
            <p>Final Amount</p>
            <p>
              {priceConversion(
                grandTotal + totalTransferPrice,
                selectedCurrency,
                true
              )}
            </p>
          </div>
           )}

           


          </div>
        )}
      </div>
    );
  };

  const backfunction = () => {
    window?.history?.back();
  };

  return (
    <div className="container mb-10 relative z-10 mt-11 flex flex-col gap-10">
      {/* BREADCRUMBS */}
      <div className="my-3 flex justify-between">
        <div
          onClick={() => backfunction()}
          className="flex items-center cursor-pointer text-center gap-3"
        >
          <ArrowLeftIcon height={20} width={20} />
          <p>Back</p>
        </div>
        <Breadcrumb breadCrumbs={breadcrum} />
      </div>

      {cart.length || transferCart.length ? (
        <form onSubmit={submitHandler}>
          <div className="flex lg:flex-row gap-10 w-full">
            <div className="md:w-8/12 space-y-10">
              {cart.length ? renderSidebar() : ""}
              {transferCart.length ? renderTransfer() : ""}
              <div className="md:hidden block">{renderDetailsCollection()}</div>
              {cart.length || transferCart.length ? renderPaymentSection() : ""}
            </div>

            {/* SIDEBAR */}
            <div className="hidden lg:block w-4/12 flex-grow mt-14 lg:mt-0">
              {renderDetailsCollection()}
              {PriceSidebar()}
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div className="listingSectionSidebar__wrap shadow max-w-sm mb-20">
            <div className="flex flex-wrap gap-2 items-center justify-center text-neutral-600 dark:text-neutral-400">
              <i className="las la-cart-plus text-3xl "></i>
              <p className="">Your cart is empty.</p>
            </div>
            <ButtonPrimary href="/">Continue Shopping</ButtonPrimary>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
