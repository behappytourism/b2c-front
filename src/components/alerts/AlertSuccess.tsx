import React, { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { setAlertSuccess } from "@/redux/features/transferSlice";
import { RootState } from "@/redux/store";

function SuccessAlert() {
  const dispatch = useDispatch();
  const { alertSuccess } = useSelector((state: RootState) => state.transfer);

  useEffect(() => {
    if (alertSuccess?.status === true) {
      setTimeout(() => {
        dispatch(
          setAlertSuccess({
            status: false,
            title: "",
            text: "",
          })
        );
      }, 5000);
    }
  }, [alertSuccess?.status]);

  return (
    <div
      className={`fixed  bottom-20 p-4 z-50 max-w-full md:max-w-[55%] lg:max-w-[35%] transition-all duration-500   ${
        alertSuccess?.status === true ? " right-0 " : " right-[-100vw] "
      }`}
    >
      <div className="w-full max-w-xl p-6 mt-auto ml-auto bg-white shadow-[0_4px_10px_7px_rgb(56_65_74_/_20%)] rounded-lg">
        <div className="flex items-start justify-between -mx-2">
          <div className="flex items-start px-2">
            <span className="flex-shrink-0 text-3xl text-green-600">
              <CheckCircleIcon height={40} width={40} />
            </span>
            <div className="ml-2">
              <h5 className="text-gray-500 font-semibold">
                {alertSuccess?.title}
              </h5>
              <span className="text-xs font-medium text-gray-400">
                {alertSuccess?.text}
              </span>
            </div>
          </div>
          <div className="px-2">
            <button
              className="inline-block text-gray-400 hover:text-gray-300"
              onClick={() =>
                dispatch(
                  setAlertSuccess({
                    status: false,
                    title: "",
                    text: "",
                  })
                )
              }
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.17501 5.99999L10.7583 2.42499C10.9153 2.26807 11.0034 2.05524 11.0034 1.83333C11.0034 1.61141 10.9153 1.39858 10.7583 1.24166C10.6014 1.08474 10.3886 0.996582 10.1667 0.996582C9.94476 0.996582 9.73193 1.08474 9.57501 1.24166L6.00001 4.82499L2.42501 1.24166C2.26809 1.08474 2.05526 0.996582 1.83334 0.996582C1.61143 0.996582 1.3986 1.08474 1.24168 1.24166C1.08476 1.39858 0.9966 1.61141 0.9966 1.83333C0.9966 2.05524 1.08476 2.26807 1.24168 2.42499L4.82501 5.99999L1.24168 9.57499C1.16357 9.65246 1.10157 9.74463 1.05927 9.84618C1.01696 9.94773 0.995178 10.0566 0.995178 10.1667C0.995178 10.2767 1.01696 10.3856 1.05927 10.4871C1.10157 10.5887 1.16357 10.6809 1.24168 10.7583C1.31915 10.8364 1.41131 10.8984 1.51286 10.9407C1.61441 10.983 1.72333 11.0048 1.83334 11.0048C1.94335 11.0048 2.05227 10.983 2.15382 10.9407C2.25537 10.8984 2.34754 10.8364 2.42501 10.7583L6.00001 7.17499L9.57501 10.7583C9.65248 10.8364 9.74465 10.8984 9.8462 10.9407C9.94775 10.983 10.0567 11.0048 10.1667 11.0048C10.2767 11.0048 10.3856 10.983 10.4872 10.9407C10.5887 10.8984 10.6809 10.8364 10.7583 10.7583C10.8364 10.6809 10.8984 10.5887 10.9408 10.4871C10.9831 10.3856 11.0048 10.2767 11.0048 10.1667C11.0048 10.0566 10.9831 9.94773 10.9408 9.84618C10.8984 9.74463 10.8364 9.65246 10.7583 9.57499L7.17501 5.99999Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessAlert;
