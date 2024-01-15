import React, { FC } from "react";
import { TaxonomyType } from "@/data/types";
import convertNumbThousand from "@/utils/convertNumbThousand";
import Link from "next/link";
import Image from "next/image";
import { InitialAttractionDestiantions } from "@/data/general/types";

export interface CardCategory3Props {
  className?: string;
  taxonomy: InitialAttractionDestiantions;
}

const CardCategory3: FC<CardCategory3Props> = ({
  className = "",
  taxonomy,
}) => {
  const { name, image } = taxonomy;
  return (
    <Link href={`/${name}`} className={`nc-CardCategory3 flex flex-col ${className}`}>
      <div
        className={`flex-shrink-0 relative w-full aspect-w-5 aspect-h-5 sm:aspect-h-6 h-0 rounded-2xl overflow-hidden group`}
      >
        <Image
          src={image ? `${process.env.NEXT_PUBLIC_CDN_URL + image}` : ""}
          className="object-cover w-full h-full rounded-2xl"
          alt="places"
          fill
          sizes="(max-width: 400px) 100vw, 300px"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      <div className="-mt-8 rounded-b-2xl z-20 pl-4 bg-black truncate">
        <h2
          className={`text-base mt-1 font-bold sm:text-lg text-white dark:text-neutral-100 truncate capitalize`}
        >
          {name}
        </h2>
        <span
          className={`block mt-1.5 text-sm text-neutral-6000 dark:text-neutral-400`}
        >
          {/* {convertNumbThousand(count || 0)} properties */}
        </span>
      </div>
    </Link>
  );
};

export default CardCategory3;
