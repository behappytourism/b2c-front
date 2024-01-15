"use client"

import ListCardsExp from "@/components/Attraction/ListCardsExp"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"


const favourites = () => {

    const { favourites } = useSelector((state: RootState) => state.attraction)
    return (
        <div className={`nc-AuthorPage `}>

            <div className="space-y-6 sm:space-y-8">
                {/* HEADING */}
                <h2 className="text-3xl font-semibold">Favourites</h2>
                <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
                {favourites?.length ? (

                    <div className="">
                        {favourites?.map((data) => (
                            <ListCardsExp key={data?._id} data={data} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex justify-start h-full items-center ">
                        <p className="font-mono text-lg tracking-wide text-gray-500">Sorry! No favourites found!.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default favourites