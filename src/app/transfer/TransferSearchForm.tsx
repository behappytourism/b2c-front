import Input from "@/shared/Input";
import React, { FC, useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { storeTransferResults } from "@/redux/features/transferSlice";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface ExperiencesSearchFormProps {
  closeModal?: () => void;
}

interface Transfer {
  airports?: {
    _id: string;
    suggestionType: string;
    airportName: string;
    countryName: string;
    airportId: string;
  }[];
  areas?: {
    areaName: string;
    countryName: string;
  }[];
  hotels?: {
    hotelName: string;
    areaName: string;
    countryName: string;
  }[];
}

const TransferSearchForm: FC<ExperiencesSearchFormProps> = ({ closeModal }) => {
  const dispatch = useDispatch();
  const route = useRouter();
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedReturnHour, setSelectedReturnHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedReturnMinute, setSelectedReturnMinute] = useState<number>(0);
  const [selectedAdult, setSelectedAdult] = useState<number>(1);
  const [selectedChildren, setSelectedChildren] = useState<number>(0);
  const [showArraiDate, setShowArraiDate] = useState(false);
  const [showReturnDate, setShowReturnDate] = useState(false);
  const [showPax, setShowPax] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [fromDestination, setFromDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTo, setShowTo] = useState(false);
  const [toDestination, setToDestination] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");

  const [transferSuggestion, setTransferSuggestion] = useState<Transfer | null>(
    null
  );

  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffSuggestionType, setDropoffSuggestionType] = useState("");
  const [noOfAdults, setNoOfAdults] = useState(1);
  const [noOfChildrens, setNoOfChildrens] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupSuggestionType, setPickupSuggestionType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [transferType, setTransferType] = useState("oneway");
  const [search, setSearch] = useState(false);
  const [inputsFilled, setInputsFilled] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const allInputsFilled =
      fromDestination !== "" &&
      toDestination !== "" &&
      pickupDate !== "" &&
      pickupTime !== "" &&
      (transferType === "oneway" ||
        (transferType === "return" && returnDate !== "" && returnTime !== ""));
    setInputsFilled(allInputsFilled);
  }, [
    fromDestination,
    toDestination,
    pickupDate,
    returnDate,
    transferType,
    pickupTime,
    returnTime,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToSearchQuery(e.target.value);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      fromInputRef.current &&
      !fromInputRef.current.contains(e.target as Node)
    ) {
      setShowFrom(false);
    }
  };

  const handleToClickOutside = (e: MouseEvent) => {
    if (toInputRef.current && !toInputRef.current.contains(e.target as Node)) {
      setShowTo(false);
    }
  };

  useEffect(() => {
    // Attach click event listener when component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  useEffect(() => {
    // Attach click event listener when component mounts
    document.addEventListener("click", handleToClickOutside);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleToClickOutside);
    };
  }, []);

  const fetchTransferSuggestion = async (searchQuery: string) => {
    try {
      const transferSuggestion = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/v1/transfer/search/suggestions?search=${
          searchQuery || toSearchQuery
        }&isoCode=AE`
      );
      return transferSuggestion.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function getTransferSuggestion(searchQuery: string) {
    try {
      const response = await fetchTransferSuggestion(searchQuery);
      setTransferSuggestion(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    {
      searchQuery?.length > 2 && getTransferSuggestion(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    {
      toSearchQuery?.length > 2 && getTransferSuggestion(toSearchQuery);
    }
  }, [toSearchQuery]);

  const transferSearch = async () => {
    setSearch(true);
    const body = {
      dropOffLocation: dropoffLocation,
      dropOffSuggestionType: dropoffSuggestionType,
      noOfAdults: noOfAdults,
      noOfChildrens: noOfChildrens,
      pickupDate: pickupDate,
      pickupLocation: pickupLocation,
      pickupSuggestionType: pickupSuggestionType,
      pickupTime: pickupTime,
      returnDate: returnDate,
      returnTime: returnTime,
      transferType: transferType,
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

  async function transferResults() {
    try {
      const response = await transferSearch();

      {
        response && dispatch(storeTransferResults([response]));
      }

      {
        response &&   localStorage.removeItem("selectedVehicles");
      }

      {
        response && route.push("/transfer/list");
      }

      {
        response && closeModal && closeModal();
      }

      {
        response && setAlert(false);
      }

      {
        response && setSearch(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Function to handle hour selection
  const handleHourChange = (e: any) => {
    setSelectedHour(parseInt(e.target.value, 10));
  };

  // Function to handle minute selection
  const handleMinuteChange = (e: any) => {
    setSelectedMinute(parseInt(e.target.value, 10));
  };

  const handleReturnHourChange = (e: any) => {
    setSelectedReturnHour(parseInt(e.target.value, 10));
  };

  // Function to handle minute selection
  const handleReturnMinuteChange = (e: any) => {
    setSelectedReturnMinute(parseInt(e.target.value, 10));
  };

  const handleAdultChange = (e: any) => {
    setSelectedAdult(e.target.value);
  };

  const handleChildrenChange = (e: any) => {
    setSelectedChildren(e.target.value);
  };

  const hourOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    hourOptions.push(
      <option key={hour} value={hour}>
        {hour < 10 ? `0${hour}` : hour}
      </option>
    );
  }

  const handleFromDestination = (e: any) => {
    setFromDestination(`${e?.airportName || e?.areaName}, ${e?.countryName}`);
    setPickupLocation(`${e?._id}`);
    setPickupSuggestionType(`${e?.suggestionType}`);
    setShowFrom(false);
    setSearchQuery("");
  };

  const fromInput = () => {
    setShowFrom(true);
    setShowTo(false);
  };

  const toInput = () => {
    setShowFrom(false);
    setShowTo(true);
  };

  const handleFromHotelDestination = (e: any) => {
    setFromDestination(`${e?.hotelName}, ${e?.areaName}, ${e?.countryName}`);
    setShowFrom(false);
    setPickupLocation(`${e?._id}`);
    setPickupSuggestionType(`${e?.suggestionType}`);
    setSearchQuery("");
  };

  const handleToDestination = (e: any) => {
    setToDestination(`${e?.airportName || e?.areaName}, ${e?.countryName}`);
    setShowTo(false);
    setDropoffLocation(`${e?._id}`);
    setDropoffSuggestionType(`${e?.suggestionType}`);
    setToSearchQuery("");
  };

  const handleToHotelDestination = (e: any) => {
    setToDestination(`${e?.hotelName}, ${e?.areaName}, ${e?.countryName}`);
    setDropoffLocation(`${e?._id}`);
    setDropoffSuggestionType(`${e?.suggestionType}`);
    setShowTo(false);
    setToSearchQuery("");
  };

  useEffect(() => {
    if (selectedHour) {
      setPickupTime(`${selectedHour}:${selectedMinute || "00"}`);
    }

    if (selectedReturnHour) {
      setReturnTime(`${selectedReturnHour}:${selectedReturnMinute || "00"}`);
    }
  }, [selectedHour, selectedMinute, selectedReturnHour, selectedReturnMinute]);

  return (
    <>
      <div className="max-h-[600px] md:overflow-visible overflow-x-auto py-10 px-12 backdrop-blur-xl rounded bg-opacity-30 bg-secondary-900">
        <div className="flex gap-5 mb-3">
          <div className="flex gap-1 items-center">
            <input
              defaultChecked={transferType === "oneway"}
              id="oneway"
              type="radio"
              value="oneway"
              name="transferType"
              className="w-5 h-5"
              onChange={(e) => setTransferType("oneway")}
            />
            <label className="ms-1 text-md text-white">One Way</label>
          </div>

          <div className="flex gap-1 items-center">
            <input
              defaultChecked={transferType === "return"}
              id="return"
              type="radio"
              value="return"
              name="transferType"
              className="w-5 h-5"
              onChange={(e) => setTransferType("return")}
            />
            <label className="ms-1 text-md text-white">Return</label>
          </div>
        </div>

        <div className="md:flex md:gap-10 w-full md:mb-10 mb-5">
          <div className="w-full mb-5 md:mb-0">
            <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
              From <span className="text-red-700 text-lg  ml-1 -mt-1  absolute">*</span>
            </label>
            <div className="flex items-center justify-end">
              <Input
                onChange={handleInputChange}
                onClick={fromInput}
                value={searchQuery}
                ref={fromInputRef}
                required
                className=" placeholder:text-black dark:placeholder:text-neutral-100 placeholder:mr-2"
                placeholder={
                  fromDestination || "Pickup (Airport, Train, Hotel)"
                }
              />

              {fromDestination !== "" && (
                <div className="cursor-pointer hidden md:block absolute mr-[3px]">
                  <XMarkIcon
                    onClick={() => setFromDestination("")}
                    height={25}
                    width={25}
                  />
                </div>
              )}
            </div>
          </div>
          {showFrom === true && (
            <div className="absolute z-10 border border-black md:mt-20 -mt-5 dark:bg-neutral-900 bg-white dark:bg- mr-3 md:mr-0 md:min-w-[480px] p-2 rounded-lg max-h-[300px] overflow-y-auto">
              {searchQuery.length < 2 && <p>please type atleast 3 letters</p>}

              {searchQuery.length > 2 && (
                <div>
                  {transferSuggestion &&
                    transferSuggestion.airports &&
                    transferSuggestion?.airports.length > 0 && (
                      <div className="mb-3">
                        <p className="font-bold text-primary-300  border-b w-fit mb-2">
                          Airports
                        </p>
                        {transferSuggestion?.airports?.map(
                          (airport: any, index: number) => (
                            <div
                              onClick={() => handleFromDestination(airport)}
                              className="mb-2 border-b p-3 cursor-pointer"
                            >
                              <p className="font-semibold">
                                {airport?.airportName}
                              </p>
                              <p className="text-sm text-gray-400">
                                {airport?.countryName}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {transferSuggestion &&
                    transferSuggestion.areas &&
                    transferSuggestion?.areas.length > 0 && (
                      <div className="mb-3">
                        <p className="font-bold border-b text-primary-300 w-fit mb-2">
                          Areas
                        </p>
                        {transferSuggestion?.areas?.map(
                          (area: any, index: number) => (
                            <div
                              onClick={() => handleFromDestination(area)}
                              className="mb-2 border-b p-3 cursor-pointer"
                            >
                              <p className="font-semibold">{area?.areaName}</p>
                              <p className="text-sm text-gray-400">
                                {area?.cityName},{area?.countryName}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {transferSuggestion &&
                    transferSuggestion.hotels &&
                    transferSuggestion?.hotels.length > 0 && (
                      <div className="mb-3">
                        <p className="font-bold border-b text-primary-300 w-fit mb-2">
                          Hotels
                        </p>
                        {transferSuggestion?.hotels?.map(
                          (hotel: any, index: number) => (
                            <div
                              onClick={() => handleFromHotelDestination(hotel)}
                              className="mb-2 border-b p-3 cursor-pointer"
                            >
                              <p className="font-semibold">
                                {hotel?.hotelName}
                              </p>
                              <p className="text-sm text-gray-400">
                                {hotel?.cityName},{hotel?.countryName}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          <div className="w-full md:pr-28">
            <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
              To <span className="text-red-700 text-lg  ml-1 -mt-1  absolute">*</span>
            </label>
            <div className="flex items-center justify-end">
              <Input
                onChange={handleToInputChange}
                onClick={toInput}
                ref={toInputRef}
                required
                value={toSearchQuery}
                className=" placeholder:text-black dark:placeholder:text-neutral-100 placeholder:mr-2"
                placeholder={toDestination || "Drop (Airport, Train, Hotel)"}
              />

              {toDestination !== "" && (
                <div className="cursor-pointer hidden md:block absolute mr-[3px]">
                  <XMarkIcon
                    onClick={() => setToDestination("")}
                    height={25}
                    width={25}
                  />
                </div>
              )}
            </div>
          </div>

          {showTo === true && (
            <div className="absolute z-10 border border-black md:mt-20 md:ml-[620px] mr-3 md:mr-0 dark:bg-neutral-900 bg-white md:min-w-[480px] p-2 rounded-lg max-h-[300px] overflow-y-auto">
              {toSearchQuery.length < 2 && <p>please type atleast 3 letters</p>}

              {toSearchQuery.length > 2 && (
                <div>
                  {transferSuggestion &&
                    transferSuggestion.airports &&
                    transferSuggestion?.airports?.length > 0 && (
                      <div className="mb-3">
                        <p className="font-bold border-b text-primary-300 w-fit mb-2">
                          Airports
                        </p>
                        {transferSuggestion?.airports?.map(
                          (airport: any, index: number) => (
                            <div
                              onClick={() => handleToDestination(airport)}
                              className="mb-2 border-b p-3 cursor-pointer"
                            >
                              <p className="font-semibold">
                                {airport?.airportName}
                              </p>
                              <p className="text-sm text-gray-400">
                                {airport?.countryName}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {transferSuggestion &&
                    transferSuggestion.areas &&
                    transferSuggestion?.areas.length > 0 && (
                      <div className="mb-3">
                        <p className="font-bold border-b text-primary-300 w-fit mb-2">
                          Areas
                        </p>
                        {transferSuggestion?.areas?.map(
                          (area: any, index: number) => (
                            <div
                              onClick={() => handleToDestination(area)}
                              className="mb-2 border-b p-3 cursor-pointer"
                            >
                              <p className="font-semibold">{area?.areaName}</p>
                              <p className="text-sm text-gray-400">
                                {area?.cityName},{area?.countryName}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {transferSuggestion &&
                    transferSuggestion.hotels &&
                    transferSuggestion?.hotels.length > 0 && (
                      <div className="mb-3">
                        <p className="font-bold border-b text-primary-300  w-fit mb-2">
                          Hotels
                        </p>
                        {transferSuggestion?.hotels?.map(
                          (hotel: any, index: number) => (
                            <div
                              onClick={() => handleToHotelDestination(hotel)}
                              className="mb-2 border-b p-3 cursor-pointer"
                            >
                              <p className="font-semibold">
                                {hotel?.hotelName}
                              </p>
                              <p className="text-sm text-gray-400">
                                {hotel?.cityName},{hotel?.countryName}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:flex md:gap-10">
          <div className="md:flex md:gap-5 mb-5 md:mb-0">
            <div className="mb-5 md:mb-0">
              <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
                Date and time of arrival <span className="text-red-700 text-lg ml-1 -mt-1  absolute">*</span>
              </label>
              <div className="md:flex">
                <input
                  onChange={(e) => setPickupDate(`${e.target.value}`)}
                  className="border-none w-full dark:bg-neutral-900 dark:text-neutral-100 text-black md:w-fit mb-3 md:mb-0 rounded-lg md:rounded-none md:rounded-l-lg cursor-pointer"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />

                <div
                  className="p-3 flex min-w-[100px] dark:bg-neutral-900 dark:text-neutral-100 border-l border-gray-300 rounded-lg md:rounded-none md:rounded-r-lg justify-between bg-white cursor-pointer"
                  onClick={() => {
                    setShowArraiDate(!showArraiDate);
                  }}
                >
                  <div className="flex">
                    <h1 className="text-sm">
                      {selectedHour
                        ? `${selectedHour}:${selectedMinute || "00"}`
                        : "Select Time"}
                    </h1>
                  </div>
                </div>

                {showArraiDate && (
                  <div className="items-center  dark:bg-neutral-900 dark:text-neutral-100 space-x-2 absolute bg-white p-2 rounded-lg flex md:left-[230px] md:mt-14">
                    {/* Hour Selector */}
                    <div className="flex gap-5">
                      <select
                        className="border p-2 rounded min-w-[60px] dark:bg-neutral-800"
                        onChange={handleHourChange}
                        value={selectedHour}
                        required
                      >
                        {hourOptions}
                      </select>

                      {/* Minute Selector */}
                      <select
                        className="border p-2 rounded min-w-[60px] dark:bg-neutral-800"
                        onChange={handleMinuteChange}
                        value={selectedMinute}
                      >
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                          (minute) => (
                            <option key={minute} value={minute}>
                              {minute < 10 ? `0${minute}` : minute}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <button
                      className="p-2 bg-primary-300 dark:bg-neutral-800 hover:bg-primary-400 rounded min-w-[80px] self-center min-h-[20px] text-white"
                      onClick={() => {
                        setShowArraiDate(!showArraiDate);
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
                Date and time of departure <span className={`text-red-700 ${transferType === "return" ? "absolute" : "hidden"} ml-1 -mt-1 text-lg`}>*</span>
              </label>
              <div className="md:flex">
                <input
                  onChange={(e) => setReturnDate(`${e.target.value}`)}
                  className={`border-none dark:bg-neutral-900 dark:text-neutral-100 text-black rounded-lg md:rounded-none w-full mb-3 md:mb-0 md:w-fit md:rounded-l-lg ${
                    transferType === "return" ? "cursor-pointer" : ""
                  } ${
                    transferType === "oneway" ? "text-gray-400" : "text-black"
                  }`}
                  disabled={transferType === "oneway"}
                  type="date"
                  required
                  min={pickupDate}
                />

                {transferType === "return" && (
                  <div
                    className="p-3 flex justify-between dark:bg-neutral-900 dark:text-neutral-100 min-w-[100px]  md:border-l border-gray-300 rounded-lg md:rounded-none md:rounded-r-lg bg-white cursor-pointer"
                    onClick={() => {
                      setShowReturnDate(!showReturnDate);
                    }}
                  >
                    <div className="flex">
                      <h1 className="text-sm ">
                        {returnTime ? returnTime : "Select Time"}
                      </h1>
                    </div>

                    {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
                  </div>
                )}

                {transferType === "oneway" && (
                  <div className="p-3 flex justify-between min-w-[100px] dark:bg-neutral-900 dark:text-neutral-100  md:border-l border-gray-300 rounded-lg md:rounded-none md:rounded-r-lg bg-white">
                    <div className="flex">
                      <h1 className="text-sm text-gray-400">
                        {returnTime ? returnTime : "Select Time"}
                      </h1>
                    </div>

                    {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
                  </div>
                )}

                {showReturnDate && transferType === "return" && (
                  <div className="items-center dark:bg-neutral-900 space-x-2 absolute bg-white p-2 rounded-lg flex md:left-[520px] md:mt-14">
                    {/* Hour Selector */}
                    <div className="flex gap-5">
                      <select
                        className="border p-2 rounded min-w-[60px] dark:bg-neutral-800"
                        onChange={handleReturnHourChange}
                        value={selectedReturnHour}
                        required
                      >
                        {hourOptions}
                      </select>

                      {/* Minute Selector */}
                      <select
                        className="border p-2 rounded min-w-[60px] dark:bg-neutral-800"
                        onChange={handleReturnMinuteChange}
                        value={selectedReturnMinute}
                      >
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                          (minute) => (
                            <option key={minute} value={minute}>
                              {minute < 10 ? `0${minute}` : minute}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <button
                      className="p-2 bg-primary-300 dark:bg-neutral-800 hover:bg-primary-400 rounded min-w-[80px] self-center min-h-[20px] text-white"
                      onClick={() => {
                        setShowReturnDate(!showReturnDate);
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:flex md:gap-5 justify-center items-center">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
                Passengers
              </label>
              <div
                className="p-3 flex rounded dark:bg-neutral-900 dark:text-neutral-100 justify-between min-w-[200px] bg-white cursor-pointer"
                onClick={() => {
                  setShowPax(!showPax);
                }}
              >
                <div className="flex text-sm">
                  <p>{selectedAdult} ADULT,</p>

                  <p className="ml-2">{selectedChildren} CHILDREN</p>
                </div>

                {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
              </div>

              {showPax && (
                <div className="items-center  dark:bg-neutral-900 dark:text-neutral-100 space-x-2 absolute bg-white p-2 rounded-lg flex md:left-[670px] md:mt-2">
                  <div className="flex gap-5">
                    <select
                      className="border p-2 rounded min-w-[60px] dark:bg-neutral-800"
                      onChange={handleAdultChange}
                      value={selectedAdult}
                    >
                      {Array.from({ length: 10 }).map((val, ind) => (
                        <option
                          onClick={() => setNoOfAdults(ind + 1)}
                          value={ind + 1}
                        >
                          {ind + 1}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border p-2 rounded min-w-[60px] dark:bg-neutral-800"
                      onChange={handleChildrenChange}
                      value={selectedChildren}
                    >
                      {Array.from({ length: 6 }).map((val, ind) => (
                        <option
                          onClick={() => setNoOfChildrens(ind + 1)}
                          value={ind}
                        >
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="p-2 bg-primary-300 dark:bg-neutral-800 hover:bg-primary-400 rounded min-w-[80px] self-center min-h-[20px] text-white"
                    onClick={() => {
                      setShowPax(!showPax);
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            <div>
              {search === false && (
                <>
                  {inputsFilled && (
                    <button
                      onClick={() => transferResults()}
                      disabled={!inputsFilled}
                      className="p-2 mt-6 dark:bg-neutral-900 dark:text-neutral-100 bg-primary-300 w-full md:w-fit hover:bg-primary-400 rounded min-w-[200px] self-center min-h-[50px] text-white"
                    >
                      Search
                    </button>
                  )}

                  {!inputsFilled && (
                    <>
                    <button
                      onClick={() => setAlert(true)}
                      className="p-2 mt-6 dark:bg-neutral-900 dark:text-neutral-100 bg-primary-300 w-full md:w-fit hover:bg-primary-400 rounded min-w-[200px] self-center min-h-[50px] text-white"
                    >
                      Search
                    </button>
                    
                    {alert === true && (
                      <div className="absolute flex gap-2 bg-slate-300 rounded p-2">
                      <p>Please fill all the relevant empty inputs before searching, Thank You.</p>
                      <XMarkIcon className="absolute right-0 cursor-pointer" width={30} height={30} onClick={() => setAlert(false)} />
                      </div>
                    )}
                    </>
                  )}
                </>
              )}

              {search === true && (
                <button
                  type="button"
                  className="p-2 dark:bg-neutral-900 dark:text-neutral-100 mt-6 min-w-[200px] w-full md:w-fit bg-primary-300  text-sm font-medium text-white self-center min-h-[50px] rounded dark:border-gray-600  flex justify-center items-center"
                >
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
                  Searching...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferSearchForm;
