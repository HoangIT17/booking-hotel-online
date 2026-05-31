import { Link, useLocation } from "react-router-dom";
import style from "./Header.module.css";
import LogoHotel from "../../assets/images/logohotel.png";

const Header = () => {
  return (
    <div className="flex pt-0 pr-[181px] pb-px pl-[181px] flex-col items-start border-b border-b-[#E4E4E7] bg-[rgba(252,252,253,0.80)] min-w-screen min-h-screen absolute left-0 top-0">
      <div className="flex py-0 px-6 justify-between items-center shrink-0 w-full h-full">
        <div className="flex items-center gap-2 w-[120px] h-8">
          <div className="flex py-0 px-1.5 justify-center items-center shrink-0 rounded-xl bg-[#18181B] w-8 h-8">
            <div className="shrink-0 w-5 h-5 overflow-hidden relative">
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[17px] h-[17px] absolute left-0.5 top-0.5 "
              >
                <path
                  d="M7.44622 12.0835C7.37183 11.7951 7.22151 11.532 7.01091 11.3214C6.8003 11.1108 6.53712 10.9604 6.24872 10.886L1.13622 9.56771C1.049 9.54295 0.972232 9.49042 0.917568 9.41808C0.862904 9.34574 0.833328 9.25754 0.833328 9.16687C0.833328 9.0762 0.862904 8.98801 0.917568 8.91567C0.972232 8.84333 1.049 8.7908 1.13622 8.76604L6.24872 7.44687C6.53701 7.37255 6.80013 7.22235 7.01073 7.01191C7.22132 6.80146 7.3717 6.53845 7.44622 6.25021L8.76456 1.13771C8.78906 1.05014 8.84154 0.972993 8.91399 0.918037C8.98644 0.863081 9.07487 0.833334 9.16581 0.833334C9.25674 0.833334 9.34518 0.863081 9.41762 0.918037C9.49007 0.972993 9.54255 1.05014 9.56706 1.13771L10.8846 6.25021C10.959 6.5386 11.1093 6.80179 11.3199 7.01239C11.5305 7.22299 11.7937 7.37331 12.0821 7.44771L17.1946 8.76521C17.2825 8.78946 17.36 8.84188 17.4153 8.91444C17.4705 8.98699 17.5004 9.07567 17.5004 9.16687C17.5004 9.25807 17.4705 9.34675 17.4153 9.41931C17.36 9.49187 17.2825 9.54429 17.1946 9.56854L12.0821 10.886C11.7937 10.9604 11.5305 11.1108 11.3199 11.3214C11.1093 11.532 10.959 11.7951 10.8846 12.0835L9.56622 17.196C9.54172 17.2836 9.48924 17.3608 9.41679 17.4157C9.34434 17.4707 9.25591 17.5004 9.16497 17.5004C9.07404 17.5004 8.98561 17.4707 8.91316 17.4157C8.84071 17.3608 8.78823 17.2836 8.76372 17.196L7.44622 12.0835Z"
                  stroke="#FAFAFA"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="2"
                height="5"
                viewBox="0 0 2 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-[3px] absolute left-[17px] top-[3px] "
              >
                <path
                  d="M0.833328 0.833334V4.16667"
                  stroke="#FAFAFA"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="5"
                height="2"
                viewBox="0 0 5 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[3px] absolute left-[15px] top-1 "
              >
                <path
                  d="M4.16666 0.833334H0.833328"
                  stroke="#FAFAFA"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="2"
                height="4"
                viewBox="0 0 2 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-0.5 absolute left-[3px] top-3.5 "
              >
                <path
                  d="M0.833328 0.833332V2.5"
                  stroke="#FAFAFA"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="4"
                height="2"
                viewBox="0 0 4 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-0.5 absolute left-[3px] top-[15px] "
              >
                <path
                  d="M2.49999 0.833332H0.833328"
                  stroke="#FAFAFA"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-start w-full h-7">
            <p className="text-[#09090B] font-inter text-xl font-bold leading-7 w-fit tracking-[-0.025em]">
              LuxeStay
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8 w-[195px] h-full">
          <div className="flex py-5 px-0 items-start shrink-0 border-b-2 border-b-[#18181B] w-[39px] h-full">
            <p className="text-[#09090B] font-inter text-sm font-medium leading-5 w-fit">
              Home
            </p>
          </div>
          <div className="flex py-5 px-0 items-start shrink-0 w-11 h-full">
            <p className="text-[#71717A] font-inter text-sm font-medium leading-5 w-fit">
              Rooms
            </p>
          </div>
          <div className="flex py-5 px-0 items-start shrink-0 w-[39px] h-full">
            <p className="text-[#71717A] font-inter text-sm font-medium leading-5 w-fit">
              Offers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-[190px] h-10">
          <div className="flex py-2 px-4 justify-center items-center shrink-0 rounded-xl w-[76px] h-10"></div>
          <button className="cursor-pointer text-nowrap flex py-2 px-4 justify-center items-center rounded-xl bg-[#18181B] shadow-[01px3px0rgba(0,0,0,0.10),01px2px-1pxrgba(0,0,0,0.10)] w-full h-10">
            <p className="text-[#FAFAFA] font-inter text-sm font-medium leading-5 w-fit">
              Sign In
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
