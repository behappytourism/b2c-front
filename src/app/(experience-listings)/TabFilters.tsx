"use client";

import React, { Fragment, useState, useEffect, FC, ChangeEvent } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/Checkbox";
import convertNumbThousand from "@/utils/convertNumbThousand";
import Slider from "rc-slider";
import { FiltersType } from "@/data/attraction/types";
import priceConversion from "@/utils/priceConversion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


const timeOfdays = [
  {
    name: "Upto 1 Hour",
    timeDuration: "0-3600",
  },
  {
    name: "1 to 4 Hour",
    timeDuration: "3601-14400",
  },
  {
    name: "4 Hour to 1 Day",
    timeDuration: "14400-86400",
  },
  {
    name: "1 to 3 Day",
    timeDuration: "86401-259200",
  },
  {
    name: "3 Days or more",
    timeDuration: "259201-2592000",
  },
];


const starFil = [
  {
    name: "starFilter",
    count: 5
  },
  {
    name: "starFilter",
    count: 4
  },
  {
    name: "starFilter",
    count: 3
  },
  {
    name: "starFilter",
    count: 2
  },
  {
    name: "starFilter",
    count: 1
  },
]

//
const moreFilter2 = timeOfdays;

interface CategoryData {
  categoryName: string,
  _id: string,
  description: string,
  icon: string,
  updatedAt: string,
  slug: string
}



interface filterData {
  setFilters?: (newFilters: FiltersType) => void;
  filters?: FiltersType
}

const TabFilters: FC<filterData> = ({
  setFilters,
  filters
}) => {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  //
  const [isOnSale, setIsOnSale] = useState(true);
  //
  const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  const openModalMoreFilter = () => setisOpenMoreFilter(true);

  //
  const { selectedCurrency } = useSelector((state: RootState) => state.initials)
  console.log(selectedCurrency, "what' it");


  // Handle price change on attraction list.
  const handlePriceOnAfterChange = (value: number[]) => {
    if (value && filters && setFilters && typeof value !== "undefined") {
      setFilters({ ...filters, priceFrom: value[0], priceTo: value[1] })
    }
  }




  const renderXClear = () => {
    return (
      <span className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  };


  // content category only
  const categoryContent = (classNames: string = " flex flex-col px-5 py-6 gap-5 ") => {

    const [category, setCatogery] = useState<CategoryData[]>([])

    const fetchFilterCatogery = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/categories/all`)
        const data = await res.json()
        setCatogery(data)
      } catch (error) {
        console.log(error);

      }
    }

    useEffect(() => {
      fetchFilterCatogery()
    }, [])
    // handler for category on change
    const onChangeHandlerCategory = (e: React.ChangeEvent<HTMLInputElement>) => {

      if (setFilters && filters) {
        if (e.target.checked) {
          setFilters({ ...filters, category: [...filters.category, e.target.value], skip: 0 })
        } else {
          const filtered = filters.category.filter((item) => {
            item !== e.target.value
          })
          setFilters({ ...filters, category: filtered, skip: 0 })

        }
      }
    }
    return (
      <div className={`relative ${classNames}`}>
        {category.map((item) => (
          <div key={item._id} className="">
            <Checkbox
              name={"categoryType"}
              label={item.categoryName}
              className="capitalize"
              slug={item?._id}
              onChange={onChangeHandlerCategory}
              defaultChecked={filters?.category?.includes(item._id)}
            />
          </div>
        ))}
      </div>
    )
  }

  const renderCategory = () => {

    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full
              ${filters?.category?.length ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-neutral-950 "
                  : "border-neutral-300 dark:border-neutral-700"}
              border  hover:border-neutral-400 dark:hover:border-neutral-6000 focus:outline-none ${open ? "!border-primary-500 " : ""
                }`}
            >
              <span>Categories</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  {categoryContent()}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  //content duration only
  const durationContent = (classNames: string = "flex flex-col gap-5  px-5 py-6 ") => {

    const timeOfDayOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setFilters && filters) {
        if (e.target.checked) {
          setFilters({ ...filters, duration: [...filters.duration, e.target.value] })
        } else {
          const filtered = filters.duration.filter((item) => item !== e.target.value)
          setFilters({ ...filters, duration: filtered })
        }
      }
    }
    return (
      <div className={`relative  ${classNames}`}>
        {timeOfdays.map((item) => (
          <div key={item.name} className="">
            <Checkbox
              name={"time"}
              label={item.name}
              slug={item.timeDuration}
              defaultChecked={filters?.duration.includes(item.timeDuration)}
              onChange={timeOfDayOnChangeHandler}
            />
          </div>
        ))}
      </div>
    )
  }

  const renderTabsTimeOfDay = () => {


    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border 
               ${filters?.duration?.length
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-neutral-950 "
                  : "border-neutral-300 dark:border-neutral-700"} 
                  hover:border-neutral-400 dark:hover:border-neutral-6000 focus:outline-none ${open ? "!border-primary-500 " : ""
                }`}
            >
              <span>Duration</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900   border border-neutral-200 dark:border-neutral-700">
                  {durationContent()}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  // content  star only
  const starContent = (classNames: string = " flex flex-col px-5 py-6 gap-5 ") => {

    const onChangeHandler = (e: any) => {
      const { value } = e.target
      if (setFilters && filters) {
        if (e.target.checked) {
          setFilters({ ...filters, rating: [...filters.rating, Number(e.target.value)] })
        } else {
          const filtered: number[] = filters.duration.map((item) => parseInt(item)).filter((item) => item !== value)
          setFilters({ ...filters, rating: filtered })
        }
      }
    }
    return (
      <div className={`relative ${classNames}`}>
        {
          starFil?.map((ele, index) => (
            <div key={index} className={`flex text-sm sm:text-base `}>
              <input
                id={ele?.name}
                name={"starFilter"}
                type="checkbox"
                className="focus:ring-action-primary h-6 w-6 text-primary-500 border-primary rounded border-neutral-500 bg-white dark:bg-neutral-700  dark:checked:bg-primary-500 focus:ring-primary-500"
                value={ele?.count}
                defaultChecked={filters?.rating?.includes(ele.count)}
                onChange={(e) => onChangeHandler(e)}
              />
              <label
                className="ml-3.5 flex flex-col flex-1 justify-center"
              >
                <span className=" text-neutral-900 dark:text-neutral-100">
                  {Array.from({ length: ele.count }, (_, index) => (
                    <i key={index} className="las la-star text-orange-500"></i>
                  ))}
                </span>
              </label>
            </div>
          ))
        }
      </div>
    )
  }


  const renderStarFilters = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border 
              ${filters?.rating?.length
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-neutral-950 "
                  : "border-neutral-300 dark:border-neutral-700"} 
                 hover:border-neutral-400 dark:hover:border-neutral-6000 focus:outline-none ${open ? "!border-primary-500 " : ""
                }`}
            >
              <span>Star Rating</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900   border border-neutral-200 dark:border-neutral-700">
                  {starContent()}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderTabsPriceRage = () => {

    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border 
              ${(filters?.priceFrom && filters?.priceTo)
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-neutral-950 "
                  : "border-neutral-300 dark:border-neutral-700"} 
                 hover:border-neutral-400 dark:hover:border-neutral-6000 focus:outline-none ${open ? "!border-primary-500 " : ""
                }`}
            >
              <span>
                {`${priceConversion(
                  Number(filters?.priceFrom), selectedCurrency, true
                )} - ${priceConversion(Number(filters?.priceTo), selectedCurrency, true)}`}{" "}
              </span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 ">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-8">
                    <div className="space-y-5">
                      <span className="font-medium">Price range</span>
                      <Slider
                        range
                        min={0}
                        max={10000}
                        defaultValue={[Number(filters?.priceFrom), Number(filters?.priceTo)]}
                        allowCross={false}
                        onAfterChange={(e) => handlePriceOnAfterChange(e as number[])}
                      />
                    </div>

                    <div className="flex justify-between space-x-5">
                      <div>
                        <label
                          htmlFor="minPrice"
                          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Min price
                        </label>
                        <div className="mt-1 relative rounded-md">

                          <input
                            type="text"
                            name="minPrice"
                            disabled
                            id="minPrice"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                            value={priceConversion(Number(filters?.priceFrom), selectedCurrency, true)}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="maxPrice"
                          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Max price
                        </label>
                        <div className="mt-1 relative rounded-md">

                          <input
                            type="text"
                            disabled
                            name="maxPrice"
                            id="maxPrice"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                            value={priceConversion(Number(filters?.priceTo), selectedCurrency, true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderTabOnSale = () => {
    return (
      <div
        className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none cursor-pointer transition-all  ${isOnSale
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-neutral-950 "
          : "border-neutral-300 dark:border-neutral-700"} `}
        onClick={() => setIsOnSale(!isOnSale)}
      >
        <span>Promotions</span>
        {isOnSale && renderXClear()}
      </div>
    );
  };

  // Mobile tabs --------------------------------------------------
  const renderTabMobileFilter = () => {

    return (
      <div>
        <div
          className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={openModalMoreFilter}
        >
          <span>
            <span className="hidden sm:inline">Experiences</span> filters (3)
          </span>
          {renderXClear()}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilter}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Attraction filters
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilter} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <div className="px-4 sm:px-6 divide-y divide-neutral-200 dark:divide-neutral-800">


                      <div className="py-7">
                        <h3 className="text-xl font-medium">Star Rating</h3>
                        <div className=" relative ">
                          {starContent("flex flex-col pt-6 gap-5")}
                        </div>
                      </div>

                      {/* --------- */}

                      <div className="py-7">
                        <h3 className="text-xl font-medium">Price Range</h3>
                        <div className="mt-6 relative ">
                          <div className="relative flex flex-col space-y-8">
                            <div className="space-y-5">
                              <Slider
                                className="text-red-400"
                                range
                                min={0}
                                max={10000}
                                defaultValue={[Number(filters?.priceFrom), Number(filters?.priceTo)]}
                                allowCross={false}
                                onAfterChange={(e) => handlePriceOnAfterChange(e as number[])}
                              />
                            </div>

                            <div className="flex justify-between space-x-5">
                              <div>
                                <label
                                  htmlFor="minPrice"
                                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                  Min price
                                </label>
                                <div className="mt-1 flex gap-2 relative border pl-3 focus:ring-indigo-500 border-neutral-200 rounded-full focus:border-indigo-500">

                                  <input
                                    type="text"
                                    name="minPrice"
                                    disabled
                                    id="minPrice"
                                    className="block w-full pr-3 sm:text-sm border-none text-neutral-900"
                                    value={priceConversion(Number(filters?.priceFrom), selectedCurrency, true)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="maxPrice"
                                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                  Max price
                                </label>
                                <div className="mt-1 flex gap-2 relative border pl-3 focus:ring-indigo-500 border-neutral-200 rounded-full focus:border-indigo-500">

                                  <input
                                    type="text"
                                    disabled
                                    name="maxPrice"
                                    id="maxPrice"
                                    className="block w-full pr-3 sm:text-sm border-none text-neutral-900"
                                    value={priceConversion(Number(filters?.priceTo), selectedCurrency, true)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --------- */}

                      <div className="py-7">
                        <h3 className="text-xl font-medium">Duration</h3>
                        <div className="mt-6 relative ">
                          {durationContent(" grid grid-cols-2 gap-6")}
                        </div>
                      </div>

                      {/* --------- */}

                      <div className="py-7">
                        <h3 className="text-xl font-medium">Category</h3>
                        <div className="mt-6 relative ">
                          {categoryContent("flex flex-col pb-6 gap-5")}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4">
      <div className="hidden lg:flex space-x-4">
        {renderCategory()}
        {renderTabsPriceRage()}
        {renderTabsTimeOfDay()}
        {/* {renderTabOnSale()} */}
        {renderStarFilters()}
      </div>
      <div className="flex lg:hidden space-x-4">
        {renderTabMobileFilter()}
        {/* {renderTabOnSale()} */}
      </div>
    </div>
  );
};

export default TabFilters;
