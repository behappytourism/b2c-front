"use client";

import React, { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useWindowSize } from "react-use";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/utils/animationVariants";
import PrevBtn from "../PrevBtn";
import NextBtn from "../NextBtn";

function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfitem] = useState(0);

  const windowWidth = useWindowSize().width;
  useEffect(() => {
    if (windowWidth < 320) {
      return setNumberOfitem(1);
    }
    if (windowWidth < 500) {
      return setNumberOfitem(1);
    }
    if (windowWidth < 1024) {
      return setNumberOfitem(3 - 1);
    }
    if (windowWidth < 1280) {
      return setNumberOfitem(3 - 1);
    }

    setNumberOfitem(2);
  }, [windowWidth]);

  useEffect(() => {
    if (
      (windowWidth >= 1024 && (10 ?? 0) > currentIndex + numberOfItems) ||
      (windowWidth < 1024 && (10 ?? 0) > 1)
    ) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex < (10 ?? 0) - 1 ? prevIndex + 1 : 0
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [windowWidth, currentIndex, numberOfItems]);

  function changeItemId(newVal: number) {
    if (newVal > currentIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurrentIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < 10 - 1) {
        changeItemId(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        changeItemId(currentIndex - 1);
      }
    },
    trackMouse: true,
  });

  if (!numberOfItems) return null;

  return (
    <div className="w-full container">
    <div className="flex gap-10">
      <div className="space-y-5 w-6/12">
        <div className="bg-gray-100 w-fit px-4 py-3 rounded-3xl">
          <p className="font-semibold">Testimonials</p>
        </div>

        <div>
          <h2 className="font-extrabold text-5xl">
            What out clients are saying about us?
          </h2>
        </div>

        <div>
          <p className="text-xl font-semibold opacity-60">
            Discover unforgettable attractions and experiences across the UAE,
            straight from those who’ve enjoyed them.
          </p>
        </div>
      </div>

      <div className="flex gap-4 w-6/12 ">
        <MotionConfig
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className={`relative flow-root`} {...handlers}>
            <div className={`flow-root overflow-hidden rounded-xl`}>
              <motion.ul initial={false} className="relative whitespace-nowrap">
                <AnimatePresence initial={false} custom={direction}>
                  {[0, 1, 2, 3, 4,5,6,7,8,9].map((item, indx) => (
                    <motion.li
                      className={`relative inline-block px-2 xl:px-4`}
                      custom={direction}
                      initial={{
                        x: `${(currentIndex - 1) * -100}%`,
                      }}
                      animate={{
                        x: `${currentIndex * -100}%`,
                      }}
                      variants={variants(200, 1)}
                      key={indx}
                      style={{
                        flex: `0 0 calc(100% / ${numberOfItems})`,
                      }}
                    >
                      <TestimonialCard />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>

           
          </div>
        </MotionConfig>
      </div>
    </div>

   <div className="flex mt-10 items-center text-center gap-10 justify-center">
        <PrevBtn
        style={{ transform: "translate3d(0, 0, 0)" }}
        onClick={() => changeItemId(currentIndex - 1)}
        disabled={currentIndex <= 0}
       className={`${currentIndex <= 0 ? "cursor-not-allowed opacity-50" : ""} w-9 h-9 xl:w-12 xl:h-12 text-lg  -translate-y-1/2 z-[1]`}
        />

            <NextBtn
        disabled={currentIndex >= 9}
        style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex + 1)}
              className={`${currentIndex >= 9 ? "cursor-not-allowed opacity-50" : ""} w-9 h-9 xl:w-12 xl:h-12 text-lg -translate-y-1/2 z-[1]`}
            />

</div>
    </div>
  );
}

export default TestimonialsSection;
