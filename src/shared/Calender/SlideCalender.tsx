
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
    add,
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isAfter,
    isBefore,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfMonth,
    startOfToday,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";

export interface Meeting {
    id: string | number;
    name: string;
    imageUrl: string;
    startDatetime: string;
    endDatetime: string;
}

const meetings: Meeting[] = [
    {
        id: 1,
        name: "Created",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2023-11-10T13:00",
        endDatetime: "2023-11-11T14:30",
    },
    {
        id: 2,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-20T09:00",
        endDatetime: "2022-05-20T11:30",
    },
    {
        id: 3,
        name: "Dries Vincent",
        imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-20T17:00",
        endDatetime: "2022-05-20T18:30",
    },
    {
        id: 4,
        name: "Leslie Alexander",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-06-09T13:00",
        endDatetime: "2022-06-09T14:30",
    },
    {
        id: 5,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-13T14:00",
        endDatetime: "2022-05-13T14:30",
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function SlideCalender({
    initialSelection,
    setSelectedDate,
    handleFunction,
}: {
    initialSelection?: Date | string;
    setSelectedDate?: (date: Date | string) => void;
    handleFunction?: (date: Date | string) => void;
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    let numOfDays = 4;


    let today = initialSelection ? new Date(initialSelection) : startOfToday();

    let [selectedDay, setSelectedDay] = useState(today);

    let [currentMonth, setCurrentMonth] = useState(format(today, "dd-MMM-yyyy"));
    let selectedDayOfMonth = parse(currentMonth, "dd-MMM-yyyy", new Date());


    let days = eachDayOfInterval({
        start: selectedDayOfMonth,
        end: add(selectedDayOfMonth, { days: numOfDays }),
    });


    function previousDates() {
        let firstDaySpan = add(selectedDayOfMonth, { days: -numOfDays });
        setCurrentMonth(format(firstDaySpan, "dd-MMM-yyyy"));
    }

    function nextDates() {
        let firstDaySpan = add(selectedDayOfMonth, { days: numOfDays });
        setCurrentMonth(format(firstDaySpan, "dd-MMM-yyyy"));
    }

    function previousMonth() {
        let firstMonthSpan = startOfMonth(addMonths(selectedDayOfMonth, -1))
        setCurrentMonth(format(firstMonthSpan, "dd-MMM-yyyy"));
    }

    function nextMonth() {
        let firstMonthSpan = startOfMonth(addMonths(selectedDayOfMonth, 1))
        setCurrentMonth(format(firstMonthSpan, "dd-MMM-yyyy"));
    }

    let selectedDayMeetings: Meeting[] = meetings.filter((meeting: Meeting) =>
        isSameDay(parseISO(meeting.startDatetime), selectedDay)
    );

    // const firstDayOfNextMonth = 

    return (
        <div className="">
            <div className="">
                <div className=" space-y-10">
                    <div className="md:w-[400px]">
                        <div className="flex justify-between items-center py-2">
                            <div className="flex  items-center">
                                <button
                                    type="button"
                                    onClick={previousMonth}
                                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-500 hover:text-gray-500"
                                >
                                    <span className="sr-only">Previous month</span>
                                    <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />

                                </button>
                                <p className="text-gray-500">
                                    {format(selectedDayOfMonth, "MMMM, yyyy")}
                                </p>
                                <button
                                    onClick={nextMonth}
                                    type="button"
                                    className="-my-1.5  flex flex-none items-center justify-center p-1.5 text-gray-500 hover:text-gray-500"
                                >
                                    <span className="sr-only">Next month</span>
                                    <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />{" "}
                                </button>
                            </div>
                            <div className="flex  items-center">
                                <button
                                    type="button"
                                    onClick={previousDates}
                                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-500 hover:text-gray-500"
                                >
                                    <span className="sr-only">Previous span days</span>
                                    <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <p className="text-gray-500">
                                    Days
                                </p>
                                <button
                                    onClick={nextDates}
                                    type="button"
                                    className="-my-1.5  flex flex-none items-center justify-center p-1.5 text-gray-500 hover:text-gray-500"
                                >
                                    <span className="sr-only">Next span days</span>
                                    <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />{" "}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-0 h-52 md:w-full md:h-full border mt-2 text-sm bg-white dark:bg-gray-800 p-2 rounded-lg">
                            {days.map((day, dayIdx) => (
                                <div className="h-20" key={day.toString()}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log(day, "dayyyy");
                                            
                                            if (isAfter(day, new Date())) {
                                                setSelectedDay(day);
                                                if (setSelectedDate) {
                                                    setSelectedDate(day);
                                                }
                                                if (handleFunction) {
                                                    handleFunction(day);
                                                }
                                            }
                                        }}
                                        className={classNames(
                                            isEqual(day, selectedDay) ? "text-black" : "",
                                            !isEqual(day, selectedDay) && isToday(day)
                                                ? " text-blue-600"
                                                : "",
                                            !isEqual(day, selectedDay) &&
                                                !isToday(day) &&
                                                isSameMonth(day, selectedDayOfMonth)
                                                ? isBefore(day, new Date())
                                                    ? " text-gray-300 "
                                                    : "text-gray-900"
                                                : "",
                                            !isEqual(day, selectedDay) &&
                                                !isToday(day) &&
                                                !isSameMonth(day, selectedDayOfMonth)
                                                ? "text-gray-800"
                                                : "",
                                            isSameDay(day, selectedDay) && isToday(day)
                                                ? "hover:bg-gray-100 dark:hover:bg-neutral-950 "
                                                : "",
                                            isSameDay(day, selectedDay) && !isToday(day)
                                                ? " border border-green-600 bg-green-400/20 "
                                                : "",
                                            !isEqual(day, selectedDay)
                                                ? "hover:bg-gray-100 dark:hover:bg-neutral-950 "
                                                : "",
                                            isEqual(day, selectedDay) || isToday(day)
                                                ? "font-semibold"
                                                : isBefore(day, new Date())
                                                    ? " text-gray-300 "
                                                    : "",
                                            "mx-auto flex h-20 w-20 items-center justify-center rounded "
                                        )}
                                    >
                                        <time
                                            className="font-bold  uppercase"
                                            dateTime={format(day, "yyyy-MM-dd")}
                                        >
                                            <p
                                                className={`font-light ${!isEqual(day, selectedDay) && isToday(day)
                                                    ? " text-blue-800 "
                                                    : isEqual(day, selectedDay) && !isToday(day)
                                                        ? " text-green-700 font-medium "
                                                        : isEqual(day, selectedDay) && isToday(day)
                                                            ? " text-green-700 font-medium "
                                                            : " text-gray-500 "
                                                    } capitalize`}
                                            >
                                                {format(day, "iii")}
                                            </p>
                                            {format(day, "MMM d")}
                                            <p
                                                className={`font-light ${!isEqual(day, selectedDay) && isToday(day)
                                                    ? " text-blue-800 "
                                                    : isEqual(day, selectedDay) && !isToday(day)
                                                        ? " text-green-700 font-medium "
                                                        : isEqual(day, selectedDay) && isToday(day)
                                                            ? " text-green-700 font-medium "
                                                            : " text-gray-500 "
                                                    } capitalize`}
                                            >
                                                {format(day, "yyy")}
                                            </p>
                                        </time>
                                    </button>

                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.startDatetime), day)
                                        ) && (
                                                <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-2">
                        <p className="text-sm text-green-600 font-mono pb-2">
                            <i className="lar la-check-circle text-lg"></i>
                            <span className="pl-1">
                                Scheduled for{" "}
                                <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                                    {format(selectedDay, "MMM dd, yyy")}
                                </time>
                            </span>
                        </p>
                        <ol className=" space-y-1 text-sm leading-6 text-gray-500">
                            {selectedDayMeetings.length > 0
                                ? selectedDayMeetings.map((meeting: Meeting) => (
                                    <Meeting meeting={meeting} key={meeting.id} />
                                ))
                                : ""}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    );
}

interface MeetProps {
    meeting: Meeting;
}
function Meeting<MeetProps>({ meeting }: { meeting: Meeting }) {
    let startDateTime = parseISO(meeting.startDatetime);
    let endDateTime = parseISO(meeting.endDatetime);

    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
            <img
                src={meeting.imageUrl}
                alt=""
                className="flex-none w-10 h-10 rounded-full"
            />
            <div className="flex-auto">
                <p className="text-gray-900">{meeting.name}</p>
                <p className="mt-0.5">
                    <time dateTime={meeting.startDatetime}>
                        {format(startDateTime, "h:mm a")}
                    </time>{" "}
                    -{" "}
                    <time dateTime={meeting.endDatetime}>
                        {format(endDateTime, "h:mm a")}
                    </time>
                </p>
            </div>
        </li>
    );
}
