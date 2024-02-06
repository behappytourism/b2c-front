import Input from "@/shared/Input";
import React, { useEffect, useState } from "react";

function TransferSearchForm() {
  const [selectedHour, setSelectedHour] = useState<number>();
  const [pickupTime, setPickupTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [selectedReturnHour, setSelectedReturnHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>();
  const [selectedReturnMinute, setSelectedReturnMinute] = useState<number>();
  const [selectedAdult, setSelectedAdult] = useState<number>(1);
  const [selectedChildren, setSelectedChildren] = useState<number>();
  const [showArraiDate, setShowArraiDate] = useState(false);
  const [showReturnDate, setShowReturnDate] = useState(false);
  const [showPax, setShowPax] = useState(false);

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

  useEffect(() => {
    if (selectedHour && selectedMinute) {
      setPickupTime(`${selectedHour}:${selectedMinute}`);
    }

    if (selectedReturnHour && selectedReturnMinute) {
      setReturnTime(`${selectedReturnHour}:${selectedReturnMinute}`);
    }
  }, [selectedHour, selectedMinute, selectedReturnHour, selectedReturnMinute]);

  return (
    <div className="-ml-[200px] py-10 px-12 backdrop-blur-xl rounded bg-opacity-30 bg-black">
      <div className="flex gap-10 w-full mb-10">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
            From
          </label>
          <Input placeholder="Pickup (Airport, Train, Hotel)" />
        </div>

        <div className="w-full pr-28">
          <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
            To
          </label>
          <Input placeholder="Drop (Airport, Train, Hotel)" />
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex gap-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">
              Date and time of arrival
            </label>
            <div className="flex">
              <input className="border-none rounded-l-lg" type="date" />

              <div
                className="p-3 flex min-w-[100px] border-l border-gray-300 rounded-r-lg justify-between bg-white cursor-pointer"
                onClick={() => {
                  setShowArraiDate(!showArraiDate);
                }}
              >
                <div className="flex">
                  <h1 className="text-gray-300 text-sm ">
                    {pickupTime ? pickupTime : "Time"}
                  </h1>
                </div>

                {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
              </div>

              {showArraiDate && (
                <div className="flex items-center space-x-2">
                  {/* Hour Selector */}
                  <select
                    className="border p-2 rounded"
                    onChange={handleHourChange}
                    value={selectedHour}
                  >
                    {hourOptions}
                  </select>

                  {/* Minute Selector */}
                  <select
                    className="border p-2 rounded"
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

                  <button
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
              <input className="border-none rounded-l-lg" type="date" />

              <div
                className="p-3 flex justify-between min-w-[100px]  border-l border-gray-300 rounded-r-lg bg-white cursor-pointer"
                onClick={() => {
                  setShowReturnDate(!showReturnDate);
                }}
              >
                <div className="flex">
                  <h1 className="text-gray-300 text-sm ">
                    {returnTime ? returnTime : "Time"}
                  </h1>
                </div>

                {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
              </div>

              {showReturnDate && (
                <div className="flex items-center space-x-2">
                  {/* Hour Selector */}
                  <select
                    className="border p-2 rounded"
                    onChange={handleReturnHourChange}
                    value={selectedReturnHour}
                  >
                    {hourOptions}
                  </select>

                  {/* Minute Selector */}
                  <select
                    className="border p-2 rounded"
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

                  <button
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
              <div className="flex">
                {selectedAdult && <p>{selectedAdult}</p>}

                {selectedChildren && <p>{selectedChildren}</p>}

                {selectedAdult === null && <p>Adult</p>}
              </div>

              {/* <h1 className="text-black text-sm pt-1  ">
            <SlArrowDown />
          </h1> */}
            </div>

            {showPax && (
              <div className="flex items-center space-x-2">
                <select
                  className="border p-2 rounded"
                  onChange={handleAdultChange}
                  value={selectedAdult}
                >
                  {Array.from({ length: 11 }).map((val, ind) => (
                    <option value={ind}>{ind}</option>
                  ))}
                </select>

                <select
                  className="border p-2 rounded"
                  onChange={handleChildrenChange}
                  value={selectedChildren}
                >
                  {Array.from({ length: 6 }).map((val, ind) => (
                    <option value={ind}>{ind}</option>
                  ))}
                </select>

                <button
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
            <button className="p-2 mt-6 bg-primary-300 rounded min-w-[200px] self-center min-h-[50px] text-white">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferSearchForm;
