import { Route } from "next";
import Link from "next/link";
import { FC } from "react";

interface BreadCrumbProps {
    breadCrumbs?: BreadcrumbsList[]
}

export interface BreadcrumbsList {
    name: string;
    link: string;
    classNames: string;
}


const Breadcrumb: FC<BreadCrumbProps> = ({
    breadCrumbs = []
}) => {

    const breadcrumbData: BreadcrumbsList[] = [
        {
            name: "Home",
            link: "/",
            classNames: "",
        },
        ...breadCrumbs
    ];

    return (
        <nav
            className="flex justify-end  text-gray-700  rounded-lg  dark:border-gray-700"
            aria-label="Breadcrumb"
        >
            <ol className=" flex flex-wrap items-center space-x-1 md:space-x-3">
                {breadcrumbData?.map((item, index) => {
                    let svg;
                    if (index == 0) {
                        svg = <svg
                            className="w-3 h-3 mr-2.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                    } else {
                        svg = <svg
                            className="w-3 h-3 mx-1 text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                    }
                    return (

                        <li key={index} className="inline-flex flex-wrap items-center">
                            <Link
                                href={item?.link as Route}
                                className={`inline-flex  items-center text-xs md:text-sm font-medium ${index == breadcrumbData.length - 1 ? " text-gray-500 " : " text-gray-700 "}  hover:text-blue-600 dark:text-gray-400 dark:hover:text-white capitalize`}
                            >
                                {svg}
                                {item?.name?.length > 15 ? `${item?.name?.replace("%20", " ")?.slice(0, 15)}..` : item?.name?.replace("%20", " ")}
                            </Link>
                        </li>
                    )
                })}

            </ol>
        </nav>
    );
};

export default Breadcrumb;
