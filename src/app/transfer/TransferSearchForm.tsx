import Input from "@/shared/Input";
import React, { FC, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { storeTransferResults } from "@/redux/features/transferSlice";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";


export interface ExperiencesSearchFormProps {
  closeModal?: () => void
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

const TransferSearchForm: FC<ExperiencesSearchFormProps> = ({closeModal}) => {
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
  const [search, setSearch] = useState(false);


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
        response && route.push("/transfer/list");
      }

      {
       response && closeModal && closeModal()
      }

      {
        response && setSearch(false)
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
    <>
    <div className="md:-ml-[200px] max-h-[600px] md:overflow-visible overflow-x-auto py-10 px-12 backdrop-blur-xl rounded bg-opacity-30 bg-secondary-900">
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
          <div className="absolute md:mt-20 bg-white mr-3 md:mr-0 md:min-w-[480px] p-2 rounded-lg max-h-[300px] overflow-y-auto">
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

        <div className="w-full md:pr-28">
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
          <div className="absolute md:mt-20 md:ml-[620px] mr-3 md:mr-0 bg-white md:min-w-[480px] p-2 rounded-lg max-h-[300px] overflow-y-auto">
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

      <div className="md:flex md:gap-10">
        <div className="md:flex md:gap-5 mb-5 md:mb-0">
          <div className="mb-5 md:mb-0">
            <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
              Date and time of arrival
            </label>
            <div className="md:flex">
              <input
                onChange={(e) => setPickupDate(`${e.target.value}`)}
                className="border-none w-full md:w-fit mb-3 md:mb-0 rounded-lg md:rounded-none md:rounded-l-lg cursor-pointer"
                type="date"
              />

              <div
                className="p-3 flex min-w-[100px] border-l border-gray-300 rounded-lg md:rounded-none md:rounded-r-lg justify-between bg-white cursor-pointer"
                onClick={() => {
                  setShowArraiDate(!showArraiDate);
                }}
              >
                <div className="flex">
                  <h1 className="text-sm">
                    {pickupTime ? pickupTime : "Select Time"}
                  </h1>
                </div>

  
              </div>

              {showArraiDate && (
                <div className="items-center space-x-2 absolute bg-white p-2 rounded-lg flex md:left-[230px] md:mt-14">
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
            <div className="md:flex">
              <input
                onChange={(e) => setReturnDate(`${e.target.value}`)}
                className={`border-none rounded-lg md:rounded-none w-full mb-3 md:mb-0 md:w-fit md:rounded-l-lg ${transferType === "return" ? "cursor-pointer" : ""} ${transferType === "oneway" ? "text-gray-400" : "text-black"}`}
                disabled={transferType === "oneway"}
                type="date"
              />

              {transferType === "return" && (
              <div
                className="p-3 flex justify-between min-w-[100px]  md:border-l border-gray-300 rounded-lg md:rounded-none md:rounded-r-lg bg-white cursor-pointer"
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
                className="p-3 flex justify-between min-w-[100px]  md:border-l border-gray-300 rounded-lg md:rounded-none md:rounded-r-lg bg-white"
               
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
                <div className="items-center space-x-2 absolute bg-white p-2 rounded-lg flex md:left-[520px] md:mt-14">
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

        <div className="md:flex md:gap-5 justify-center items-center">
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
              <div className="items-center space-x-2 absolute bg-white p-2 rounded-lg flex md:left-[670px] md:mt-2">
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
            {search === false && (
            <button
              onClick={() => transferResults()}
              className="p-2 mt-6 bg-primary-300 w-full md:w-fit hover:bg-primary-400 rounded min-w-[200px] self-center min-h-[50px] text-white"
            >
              Search
            </button>
            )}

{search === true && (
           <button  type="button" className="p-2 mt-6 min-w-[200px] w-full md:w-fit bg-primary-300  text-sm font-medium text-white self-center min-h-[50px] rounded  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600  flex justify-center items-center">
           <svg aria-hidden="true" role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
           <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"></path>
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
}

export default TransferSearchForm;
