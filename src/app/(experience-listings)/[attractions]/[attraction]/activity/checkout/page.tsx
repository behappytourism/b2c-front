"use client";

import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import { BaseTypeEnum } from "@/data/attraction/types";
import {
  handleChangeCart,
  handleEmptyCart,
  handleRemoveFromCart,
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
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const CheckoutPage = () => {
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

  const [briefPayments, setBriefPayments] = useState(cart.map(() => true));

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

    // Set the flattened phonecode array to paxphoneCode
    setPaxPhoneCode(filteredPaxPhoneCode || "");
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
        item?.base === BaseTypeEnum.hourly ? item?.hourCount : undefined,
      transferType: item?.transferType,
      slot: item?.slot,
      isPromoAdded: item?.isPromoAdded,
    };
  });

  // Handling submit.
  const submitHandler = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      setError("");

      setIsLoading(true);

      if (cart.length === 0) {
        setError("Your cart is empty.");
        setIsLoading(false);
        return;
      }

      let headers = {};
      if (jwtToken?.length && jwtToken !== null && jwtToken !== undefined) {
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        };
      } else {
        headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/create`,
        {
          method: "POST",
          body: JSON.stringify({
            selectedActivities: activity,
            country: pax.country,
            name: pax.firstname + " " + pax.lastname,
            email: pax.email,
            phoneNumber: pax.phone,
            paymentProcessor: "ccavenue",
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

  const closeModal = () => {
    setError("");
  };

  const renderDetailsCollection = () => {
    return (
      <div className="rounded-lg shadow-xl p-5">
        <div className="flex gap-3 text-center items-center mb-5">
          <h2 className="text-xl font-semibold">Lead Passenger Details</h2>
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
      <div className="rounded-xl shadow-2xl p-5">
        <ErrorModal
          title="Something went wrong"
          text={error}
          isOpen={error.length > 0}
          closeModal={closeModal}
        />
        <div>
          <h2 className="text-2xl font-semibold mb-5">Pay</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            By clicking Pay Now you agree that you have read and understand our
            Terms and Conditions.
          </span>
        </div>
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}
        {/* <div className="mt-5">
          <p className="">
            {grandTotal > 0
              ? "Final Payment " +
                priceConversion(grandTotal, selectedCurrency, true)
              : ""}
          </p>
        </div> */}
        <div className="">
          <button
            className="w-full mt-5 bg-primary-500 text-white p-3 rounded-lg font-semibold"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <BtnLoader /> : "Pay Now"}{" "}
          </button>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="flex flex-col gap-5">
        {cart.length ? (
          cart.map((item, i) => (
            <div key={item._id} className="rounded-lg shadow-lg max-w-sm p-3">
              <div className="flex flex-col gap-2 text-sm">
                <div
                  className={`flex justify-between items-center gap-2 ${
                    briefPayments[i] === false ? "" : "border-b"
                  }`}
                >
                  <p className="text-md p-3 font-semibold">{item.name}</p>
                  <div className="flex gap-3">
                  <i
                    onClick={() => handleRemoveActivityFromCart(item._id)}
                    className="las la-times-circle text-xl text-red-600 cursor-pointer"
                  ></i>
                  {briefPayments[i] === false && (
                    <p>
                      <ChevronDownIcon
                        onClick={() => toggleBriefPayment(i)}
                        height={20}
                        width={20}
                      />
                    </p>
                  )}
                  {briefPayments[i] === true && (
                    <p>
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
                          item.grandTotal,
                          selectedCurrency,
                          true
                        )}
                      </span>
                    </div>
                    {item.promoCode !== "FALSE" && (
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
          ))
        ) : (
          <div>
            <div className="listingSectionSidebar__wrap shadow max-w-sm">
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

  const PriceSidebar = () => {
    return (
      <div 
      onClick={() => setFinalPayment(!finalPayment)}
      className="rounded-lg shadow-lg p-3 cursor-pointer mt-5">
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
            <div className="flex justify-between py-3">
              <p>Total Amount Incl. VAT</p>
              <p>
                {" "}
                {grandTotal > 0
                  ? "" + priceConversion(grandTotal, selectedCurrency, true)
                  : ""}
              </p>
            </div>

            <div className="flex justify-between font-bold text-xl bg-gray-200 p-3 rounded-lg">
              <p>Final Amount</p>
              <p>
                {grandTotal > 0
                  ? "" + priceConversion(grandTotal, selectedCurrency, true)
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative z-10 mt-11 flex flex-col gap-10 ">
      {/* BREADCRUMBS */}
      <Breadcrumb breadCrumbs={breadcrum} />
      <form onSubmit={submitHandler}>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-10">
            {renderDetailsCollection()}
            {cart.length ? renderPaymentSection() : ""}
          </div>

          {/* SIDEBAR */}
          <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
            {renderSidebar()}
            {PriceSidebar()}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
