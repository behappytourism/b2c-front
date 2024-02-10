import Input from "@/shared/Input";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { storeTransferResults } from "@/redux/features/transferSlice";
import { useRouter } from "next/navigation";

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

function TransferSearchForm() {
  const dispatch = useDispatch();
  const route = useRouter();
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedReturnHour, setSelectedReturnHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>();
  const [selectedReturnMinute, setSelectedReturnMinute] = useState<number>();
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

  const fetchTransferSuggestion = async (searchQuery: string) => {
    try {
      const transferSuggestion = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/v1/transfer/search/suggestions?search=${
          searchQuery || toSearchQuery
        }`
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
        response && route.push("/transfer/list");
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
    if (selectedHour && selectedMinute) {
      setPickupTime(`${selectedHour}:${selectedMinute}`);
    }

    if (selectedReturnHour && selectedReturnMinute) {
      setReturnTime(`${selectedReturnHour}:${selectedReturnMinute}`);
    }
  }, [selectedHour, selectedMinute, selectedReturnHour, selectedReturnMinute]);

  return (
    <div className="-ml-[200px] py-10 px-12 backdrop-blur-xl rounded bg-opacity-30 bg-secondary-900">
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

      <div className="flex gap-10 w-full mb-10">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
            From
          </label>
          <div className="flex items-center justify-end">
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              onClick={() => setShowFrom(!showFrom)}
              value={searchQuery}
              className=" placeholder:text-black placeholder:mr-2"
              placeholder={fromDestination || "Pickup (Airport, Train, Hotel)"}
            />

            {fromDestination !== "" && (
              <div className="cursor-pointer absolute mr-[3px]">
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
          <div className="absolute mt-20 bg-white min-w-[480px] p-2 rounded-lg max-h-[300px] overflow-y-auto">
            {searchQuery.length < 2 && <p>please type atleast 3 letters</p>}

            {searchQuery.length > 2 && (
              <div>
                <div className="mb-3">
                  <p className="font-bold border-b w-fit mb-2">Airports</p>
                  {transferSuggestion?.airports?.map(
                    (airport: any, index: number) => (
                      <div
                        onClick={() => handleFromDestination(airport)}
                        className="mb-2 border-b p-3 cursor-pointer"
                      >
                        <p className="font-semibold">{airport?.airportName}</p>
                        <p className="text-sm text-gray-400">
                          {airport?.countryName}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="mb-3">
                  <p className="font-bold border-b w-fit mb-2">Areas</p>
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

                <div className="mb-3">
                  <p className="font-bold border-b w-fit mb-2">Hotels</p>
                  {transferSuggestion?.hotels?.map(
                    (hotel: any, index: number) => (
                      <div
                        onClick={() => handleFromHotelDestination(hotel)}
                        className="mb-2 border-b p-3 cursor-pointer"
                      >
                        <p className="font-semibold">{hotel?.hotelName}</p>
                        <p className="text-sm text-gray-400">
                          {hotel?.cityName},{hotel?.countryName}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full pr-28">
          <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
            To
          </label>
          <div className="flex items-center justify-end">
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setToSearchQuery(e.target.value)
              }
              onClick={() => setShowTo(!showTo)}
              value={toSearchQuery}
              className=" placeholder:text-black placeholder:mr-2"
              placeholder={toDestination || "Drop (Airport, Train, Hotel)"}
            />

            {toDestination !== "" && (
              <div className="cursor-pointer absolute mr-[3px]">
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
          <div className="absolute mt-20 ml-[620px] bg-white min-w-[480px] p-2 rounded-lg max-h-[300px] overflow-y-auto">
            {toSearchQuery.length < 2 && <p>please type atleast 3 letters</p>}

            {toSearchQuery.length > 2 && (
              <div>
                <div className="mb-3">
                  <p className="font-bold border-b w-fit mb-2">Airports</p>
                  {transferSuggestion?.airports?.map(
                    (airport: any, index: number) => (
                      <div
                        onClick={() => handleToDestination(airport)}
                        className="mb-2 border-b p-3 cursor-pointer"
                      >
                        <p className="font-semibold">{airport?.airportName}</p>
                        <p className="text-sm text-gray-400">
                          {airport?.countryName}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="mb-3">
                  <p className="font-bold border-b w-fit mb-2">Areas</p>
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

                <div className="mb-3">
                  <p className="font-bold border-b w-fit mb-2">Hotels</p>
                  {transferSuggestion?.hotels?.map(
                    (hotel: any, index: number) => (
                      <div
                        onClick={() => handleToHotelDestination(hotel)}
                        className="mb-2 border-b p-3 cursor-pointer"
                      >
                        <p className="font-semibold">{hotel?.hotelName}</p>
                        <p className="text-sm text-gray-400">
                          {hotel?.cityName},{hotel?.countryName}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-10">
        <div className="flex gap-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
              Date and time of arrival
            </label>
            <div className="flex">
              <input
                onChange={(e) => setPickupDate(`${e.target.value}`)}
                className="border-none rounded-l-lg cursor-pointer"
                type="date"
              />

              <div
                className="p-3 flex min-w-[100px] border-l border-gray-300 rounded-r-lg justify-between bg-white cursor-pointer"
                onClick={() => {
                  setShowArraiDate(!showArraiDate);
                }}
              >
                <div className="flex">
                  <h1 className="text-sm">
                    {pickupTime ? pickupTime : "Select Time"}
                  </h1>
                </div>

                {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
              </div>

              {showArraiDate && (
                <div className="items-center space-x-2 absolute bg-white p-2 rounded-lg flex left-[230px] mt-14">
                  {/* Hour Selector */}
                  <div className="flex gap-5">
                    <select
                      className="border p-2 rounded min-w-[60px]"
                      onChange={handleHourChange}
                      value={selectedHour}
                    >
                      {hourOptions}
                    </select>

                    {/* Minute Selector */}
                    <select
                      className="border p-2 rounded min-w-[60px]"
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
                    className="p-2 bg-primary-300 hover:bg-primary-400 rounded min-w-[80px] self-center min-h-[20px] text-white"
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
              Date and time of departure
            </label>
            <div className="flex">
              <input
                onChange={(e) => setReturnDate(`${e.target.value}`)}
                className={`border-none rounded-l-lg ${transferType === "return" ? "cursor-pointer" : ""} ${transferType === "oneway" ? "text-gray-400" : "text-black"}`}
                disabled={transferType === "oneway"}
                type="date"
              />

              {transferType === "return" && (
              <div
                className="p-3 flex justify-between min-w-[100px]  border-l border-gray-300 rounded-r-lg bg-white cursor-pointer"
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
              <div
                className="p-3 flex justify-between min-w-[100px]  border-l border-gray-300 rounded-r-lg bg-white"
               
              >
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


              {showReturnDate && (
                <div className="items-center space-x-2 absolute bg-white p-2 rounded-lg flex left-[520px] mt-14">
                  {/* Hour Selector */}
                  <div className="flex gap-5">
                    <select
                      className="border p-2 rounded min-w-[60px]"
                      onChange={handleReturnHourChange}
                      value={selectedReturnHour}
                    >
                      {hourOptions}
                    </select>

                    {/* Minute Selector */}
                    <select
                      className="border p-2 rounded min-w-[60px]"
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
                    className="p-2 bg-primary-300 hover:bg-primary-400 rounded min-w-[80px] self-center min-h-[20px] text-white"
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

        <div className="flex gap-5 justify-center items-center">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
              Passengers
            </label>
            <div
              className="p-3 flex rounded justify-between min-w-[200px] bg-white cursor-pointer"
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
              <div className="items-center space-x-2 absolute bg-white p-2 rounded-lg flex left-[670px] mt-2">
                <div className="flex gap-5">
                  <select
                    className="border p-2 rounded min-w-[60px]"
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
                    className="border p-2 rounded min-w-[60px]"
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
                  className="p-2 bg-primary-300 hover:bg-primary-400 rounded min-w-[80px] self-center min-h-[20px] text-white"
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
            <button
              onClick={() => transferResults()}
              className="p-2 mt-6 bg-primary-300 hover:bg-primary-400 rounded min-w-[200px] self-center min-h-[50px] text-white"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferSearchForm;
