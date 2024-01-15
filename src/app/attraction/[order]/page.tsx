"use client";
import Breadcrumb, { BreadcrumbsList } from "@/components/General/BreadCrumb";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import Input from "@/shared/Input";
import OrderTemplate from "./OrderTemplate";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { error } from "console";

interface OrderPageProps { }

function OrderPage<OrderPageProps>({ params }: { params: { order: string } }) {
  const [orderDetails, setOrderDetails] = useState();
  const { jwtToken } = useSelector((state: RootState) => state.users);

  const findOrderDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/attractions/orders/single/${params.order}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error.message || "Something went wrong.!");
      }
      return data
    } catch (error) {
      console.log(error);
    }
  };
  async function getOrderDetails() {
    try {
      const response = await findOrderDetails();
      setOrderDetails(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    getOrderDetails()

  }, [])

  

  return (
    <div className="relative z-10 mt-11 flex flex-col gap-10 ">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full  ">
          <OrderTemplate data={orderDetails} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
