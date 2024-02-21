"use client";

export interface PaginationProps {
  className?: string;
  skip?: number;
  limit?: number;
  total: number;
  incOrDecSkip: (number: number) => void;
  updateSkip: (skip: number) => void;
}

import React, { FC } from "react";
import ButtonPrimary from "./ButtonPrimary";
import twFocusClass from "@/utils/twFocusClass";
import Button from "./Button";

export const Pagination: FC<PaginationProps> = ({
  skip = 0,
  limit = 8,
  total,
  incOrDecSkip,
  updateSkip,
}) => {
  return (
    <div className="flex flex-col flex-wrap gap-[10px] items-center ">
      <div className="text-[13px]">
        Showing {skip * limit + 1} to{" "}
        {(skip + 1) * limit > total ? total : (skip + 1) * limit} of {total}{" "}
        entries
      </div>
      <div className="flex items-center gap-[5px]">
        <ButtonPrimary
          className="px-[10px] h-[32px] font-[500] rounded-xl text-[13px disabled:cursor-not-allowed  border text-white disabled:hover:text-gray-600   disabled:hover:bg-[#fff] "
          onClick={() => incOrDecSkip(-1)}
          disabled={skip === 0}
        >
          Back
        </ButtonPrimary>
        {Array.from({
          length: total <= 10 ? 1 : Math.ceil(total / limit),
        }).map((_, index) => {
          const numberOfButtons = Math.ceil(total / limit);
          const isCurrentPage = index === skip;

          if (
            index === skip ||
            index === skip + 1 ||
            index === skip + 2 ||
            index === skip - 1 ||
            index === skip - 2 ||
            index === 0 ||
            index === numberOfButtons - 1
          ) {
            return (
              <Button
                className={
                  `inline-flex w-11 h-11 items-center justify-center rounded-full ${isCurrentPage ? 'dark:bg-primary-500' : ''} ${isCurrentPage ? 'bg-primary-200' : ''} border  ${twFocusClass(skip === index)}`
                }
                key={index}
                onClick={() => updateSkip(index)}
              >
                {index + 1}
              </Button>
            );
          }

          if (
            (skip + 1 !== numberOfButtons - 1 && skip + 3 === index) ||
            (skip - 1 !== 0 && skip - 3 === index)
          ) {
            return (
              <button key={index} className="h-[32px] min-w-[32px] px-[10px]">
                ...
              </button>
            );
          }

          return <React.Fragment key={index}></React.Fragment>;
        })}
        <ButtonPrimary
          className="px-[10px] h-[32px] font-[500] rounded-xl text-[13px disabled:cursor-not-allowed  border text-white disabled:hover:text-gray-600  disabled:hover:bg-[#fff]"
          onClick={() => incOrDecSkip(1)}
          disabled={(skip + 1) * limit >= total}
        >
          Next
        </ButtonPrimary>
      </div>
    </div>
  );
};
