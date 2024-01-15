import React, { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { ActivityExcursion } from "@/data/attraction/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import priceConversion from "@/utils/priceConversion";
import { Route } from "next";
import { usePathname } from "next/navigation";
import ModalListingActivities from "@/components/Attraction/ModalListingActivities";


interface MobileFooterStickyProps {
    activities: ActivityExcursion[]
    total?: number
}

const MobileFooterStickyAttraction: FC<MobileFooterStickyProps> = ({
    activities,
    total
}) => {

    const thisPathname = usePathname()
    const { selectedCurrency } = useSelector((state: RootState) => state.initials)

    return (
        <div className="block lg:hidden fixed bottom-14 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-40">
            <div className="container flex items-center justify-between">
                {/* {renderPage(page)} */}
                <div className="">
                    <span className="block text-xl font-semibold cursor-default">
                        {total ? priceConversion(total, selectedCurrency, true) : "Booking Selections"}
                    </span>
                    <ModalListingActivities
                        activities={activities}
                        renderChildren={({ openModal }) => (
                            <span
                                onClick={openModal}
                                className="block text-sm underline font-medium cursor-pointer"
                            >
                                {activities?.length ? "View Selected Items" : ""}
                            </span>
                        )}
                    />
                </div>

                <ButtonPrimary
                    href={`${thisPathname}/checkout` as Route}
                    sizeClass="px-5 sm:px-7 py-3 !rounded-2xl"
                >
                    Reserve
                </ButtonPrimary>
            </div>
        </div>
    );
};

export default MobileFooterStickyAttraction;
