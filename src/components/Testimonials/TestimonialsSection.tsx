"use client";

import React, { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useWindowSize } from "react-use";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/utils/animationVariants";
import PrevBtn from "../PrevBtn";
import NextBtn from "../NextBtn";

interface TestimonialsProps {
  description: string;
  image: string;
  name: string;
  place: string;
  rating: string;
}

function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfitem] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialsProps[]>([]);

  const windowWidth = useWindowSize().width;
  useEffect(() => {
    if (windowWidth < 320) {
      return setNumberOfitem(1);
    }
    if (windowWidth < 500) {
      return setNumberOfitem(1);
    }
    if (windowWidth < 1024) {
      return setNumberOfitem(4 - 1);
    }
    if (windowWidth < 1280) {
      return setNumberOfitem(4 - 1);
    }

    setNumberOfitem(3);
  }, [windowWidth]);

  useEffect(() => {
    if (
      (windowWidth >= 1024 && (testimonials.length ?? 0) > currentIndex + numberOfItems) ||
      (windowWidth < 1024 && (testimonials.length ?? 0) > 1)
    ) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex < (testimonials.length ?? 0) - 1 ? prevIndex + 1 : 0
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
      if (currentIndex < testimonials.length - 1) {
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

  const getTestimonials = async () => {
    try {
      const attraction = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/reviews`,
        { next: { revalidate: 1 } }
      );
      const data = await attraction.json();
      setTestimonials(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTestimonials();
  },[])


  if (!numberOfItems) {
    return <div>Loading...</div>; // Or any fallback UI
  }  
  

  return (
    <div className="w-full container">
    <div className="flex md:flex-row flex-col gap-10">
      <div className="space-y-5 md:w-6/12">
        <div className="bg-gray-100 w-fit px-4 py-3 rounded-3xl">
          <p className="font-semibold">Testimonials</p>
        </div>

        <div>
          <h2 className="font-extrabold text-4xl md:text-5xl">
            What out clients are saying about us?
          </h2>
        </div>

        <div>
          <p className="md:text-xl text-lg font-semibold opacity-60">
            Discover unforgettable attractions and experiences across the UAE,
            straight from those who’ve enjoyed them.
          </p>
        </div>
      </div>

      <div className="flex gap-4 md:w-6/12 ">
        <MotionConfig
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <div className={`relative flow-root`} {...handlers}>
            <div className={`hidden md:flow-root overflow-hidden rounded-xl`}>
              <motion.ul initial={false} className="relative flex">
                <AnimatePresence initial={false} custom={direction}>
                  {testimonials.map((item, indx) => (
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
                      <TestimonialCard data={item} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>


            <div className={`md:hidden flow-root overflow-hidden rounded-xl`}>
              <motion.ul initial={false} className="relative flex">
                <AnimatePresence initial={false} custom={direction}>
                  {testimonials.map((item, indx) => (
                    <motion.li
                      className={`relative inline-block`}
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
                      <TestimonialCard data={item} />
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
        disabled={currentIndex >= testimonials.length - 1}
        style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex + 1)}
              className={`${currentIndex >= testimonials.length - 1 ? "cursor-not-allowed opacity-50" : ""} w-9 h-9 xl:w-12 xl:h-12 text-lg -translate-y-1/2 z-[1]`}
            />

</div>
    </div>
  );
}

export default TestimonialsSection;
