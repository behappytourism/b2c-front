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
import { usePathname } from "next/navigation";
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
} from "@/redux/features/transferSlice";
import Link from "next/link";
import { Route } from "next";

interface vehicleType {
  name: string;
  count: number;
  price: number;
  vehicleType: string;
}

const Cart = () => {
  const thisPathname = usePathname();
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

  const { jwtToken } = useSelector((state: RootState) => state.users);
  const { cart } = useSelector((state: RootState) => state.attraction);
  const { transfer, transferCart } = useSelector(
    (state: RootState) => state.transfer
  );

  //  console.log(cart, "cart");

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
    return {
      activity: item?._id,
      date: item?.date,
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
        trip?.vehicles?.map((vehicle: any) => ({
          vehicle: vehicle?.vehicle,
          count: vehicle?.count,
        })) || [],
      selectedReturnVehicleTypes:
        trip?.returnVehicle?.map((vehicle: any) => ({
          vehicle: vehicle?.vehicle,
          count: vehicle?.count,
        })) || [],
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
            paymentMethod: "ccavenue",
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
        return acc + item.priceWithoutPromoGrandTotal;
      } else {
        return acc + item.grandTotal;
      }
    }, 0);
  }, [cart]);

  const totalTransferPrice: number = useMemo(() => {
    return transferCart.reduce((total, item) => {
      // Calculate total price for vehicles in the 'vehicles' array
      const vehiclesPrice = item.trips.reduce((tripSum, trip) => {
        const vehicleTotal = trip.vehicles.reduce((vehicleSum, vehicle) => {
          return vehicleSum + (vehicle.price || 0);
        }, 0);
        return tripSum + vehicleTotal;
      }, 0);

      // Calculate total price for vehicles in the 'returnVehicle' array
      const returnVehiclesPrice = item.trips.reduce((tripSum, trip) => {
        const returnVehicleTotal = trip.returnVehicle.reduce(
          (vehicleSum, vehicle) => {
            return vehicleSum + (vehicle.price || 0);
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="">
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
          <div className="">
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
          <div className="">
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
          <div className="">
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
          <div className="">
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
                <option className="capitalize" key={item._id} value={item._id}>
                  {item.countryName}{" "}
                </option>
              ))}
            </Select>
          </div>
          <div className="">
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
                      <div className="border p-2 rounded-lg mt-3">
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>Name</span>
                          <span className="capitalize">{vehicle?.name}</span>
                        </div>
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>Count</span>
                          <span className="capitalize">{vehicle?.count}</span>
                        </div>
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>Price</span>
                          <span className="capitalize">
                            {priceConversion(
                              vehicle?.price,
                              selectedCurrency,
                              true
                            )}
                          </span>
                        </div>
                        {vehicle?.vehicleType && (
                          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                            <span>Vehicle Type</span>
                            <span className="capitalize">
                              {vehicle?.vehicleType}
                            </span>
                          </div>
                        )}
                      </div>
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
                            <div className="border p-2 rounded-lg mt-3">
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Name</span>
                                <span className="capitalize">
                                  {returnVehicle?.name}
                                </span>
                              </div>
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Count</span>
                                <span className="capitalize">
                                  {returnVehicle?.count}
                                </span>
                              </div>
                              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                <span>Price</span>
                                <span className="capitalize">
                                  {priceConversion(
                                    returnVehicle?.price,
                                    selectedCurrency,
                                    true
                                  )}
                                </span>
                              </div>
                              {returnVehicle?.vehicleType && (
                                <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                                  <span>Vehicle Type</span>
                                  <span className="capitalize">
                                    {returnVehicle?.vehicleType}
                                  </span>
                                </div>
                              )}
                            </div>
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
                      {priceConversion(item.grandTotal, selectedCurrency, true)}
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
                            item.priceWithoutPromoGrandTotal,
                            selectedCurrency,
                            true
                          )
                        : priceConversion(
                            item.grandTotal,
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
        onClick={() => setFinalPayment(!finalPayment)}
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
                <p> {priceConversion(grandTotal, selectedCurrency, true)}</p>
              </div>
            )}

            {totalTransferPrice > 0 && (
              <div className="flex justify-between pt-1 mb-5">
                <p>Transfer Total Amount Incl. VAT</p>
                <p>
                  {" "}
                  {priceConversion(totalTransferPrice, selectedCurrency, true)}
                </p>
              </div>
            )}

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
          </div>
        )}
      </div>
    );
  };

  const backfunction = () => {
    window?.history?.back();
  }

  return (
    <div className="container relative z-10 mt-11 flex flex-col gap-10">
      {/* BREADCRUMBS */}
      <div className="my-3 flex justify-between">
        <div onClick={() => backfunction()} className="flex items-center cursor-pointer text-center gap-3">
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
