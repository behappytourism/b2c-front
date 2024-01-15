'use client'

import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setGlobalHomeData, setInitialData } from "@/redux/features/initialsSlice";
import { useEffect } from "react";




const FetchInitialData = () => {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        async function getInitialData() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/initial-data`, { next: { revalidate: 10 } })

                dispatch(setInitialData(await response.json()))
            } catch (err: any) {
                console.log(err, "initial-data");
            }
        }
        getInitialData()

    }, [dispatch])

    const fetchDetails = async () => {
        try {
            const footerDetails = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home`, { next: { revalidate: 10 } })
            if (!footerDetails.ok) {
                throw new Error("Something went wrong. Please refresh the page.")
            }
            dispatch(setGlobalHomeData(await footerDetails.json()))
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchDetails()
    }, [])




    return <></>;

}

export default FetchInitialData