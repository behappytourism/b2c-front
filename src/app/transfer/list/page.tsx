"use client";

import React, { useState } from "react";
import { TruckIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import { usePathname } from "next/navigation";


function TransferList() {
const thisPathname = usePathname();
  const [count, setCount] = useState(0);

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


  const handleCountChange = (e: any) => {
    setCount(e.target.value);
  };



  return (
    <div className="container p-5 my-20">
        <div className="mb-3">
        <Breadcrumb breadCrumbs={breadcrum} />
        </div>
      <div className="border rounded-lg p-3">
        <div className="flex justify-between p-1 mb-3 border-b">
          <h1 className="text-xl p-3 font-semibold">
            Dubai International Airport
          </h1>
          <h1 className="text-xl p-3 font-semibold">Business Bay</h1>
        </div>

        <div className="flex justify-between">
          <div className="text-lg p-3 flex gap-3 font-semibold">
            <p>Estimated Time Arrival (ETA)</p>
            <p>03:00</p>
          </div>

          <div className="text-lg p-3 flex gap-3  font-semibold">
            <p>Maximum Waiting Time</p>
            <p>60 minutes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 my-10 p-4">
        <div className="border rounded-lg p-3 w-fit">
          <TruckIcon width={20} height={20} className=" h-[100px] w-[100px]" />
          <p  className="text-xl font-semibold mb-3">12 Seater</p>
          <select
            className="border p-2 rounded min-w-[100px]"
            onChange={handleCountChange}
            value={count}
          >
            {Array.from({ length: 6 }).map((val, ind) => (
              <option value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div className="border rounded-lg p-3 w-fit">
          <TruckIcon width={20} height={20} className=" h-[100px] w-[100px]" />
          <p  className="text-xl font-semibold mb-3">14 Seater</p>
          <select
            className="border p-2 rounded min-w-[100px]"
            onChange={handleCountChange}
            value={count}
          >
            {Array.from({ length: 6 }).map((val, ind) => (
              <option value={ind}>{ind}</option>
            ))}
          </select>
        </div>
        </div>
 <div className="w-full flex justify-end">
    <Link href={"/cart"}>
      <ButtonPrimary className="min-w-[2 00px]">Checkout</ButtonPrimary>
    </Link>
      </div>
      </div>
    </div>
  );
}

export default TransferList;
