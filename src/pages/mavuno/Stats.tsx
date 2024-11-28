import React from "react";
import CountUp from "react-countup";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchMavunoStats } from "../../helpers/ApiConnectors";
import { EqualIcon, Wallet2 } from "lucide-react";

const Widgets = () => {
  const church = useAppSelector((state: any) => state.sp);

  const { data: mavuno, isLoading } = useQuery({
    queryKey: ["mavuno-stats"],
    queryFn: async () => {
      let query = `?church_id=${church.id}&&type=totals`;
      const response: any = await fetchMavunoStats(query);
      return response;
    },
  });

  console.log(mavuno);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-3 mb-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="animate-pulse" key={index}>
            <div className="text-center bg-white text-black py-4">
              <div className="flex items-center justify-center mx-auto rounded-full w-12 h-12 bg-blue-500/10 text-blue-500">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
              <h5 className="mt-4 mb-2 font-bold">
                <div className="w-24 h-6 bg-gray-300 mx-auto"></div>
              </h5>
              <p className="text-slate-500">
                <div className="w-16 h-4 bg-gray-300 mx-auto"></div>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className=" shadow-lg rounded-lg">
          <div className="text-center bg-white text-black py-4">
            <div className="flex items-center justify-center mx-auto rounded-full w-12 h-12    bg-blue-500/10 text-blue-500 ">
              <Wallet2 />
            </div>
            <h5 className="mt-4 mb-2 font-bold">
              <CountUp
                end={mavuno?.stats?.total_payments_this_month}
                className="counter-value"
              />
            </h5>
            <p className="text-slate-500 font-bold">
              Jumla makusanyo mwezi huu
            </p>
          </div>
        </div>
        <div className=" shadow-lg rounded-lg">
          <div className="text-center bg-white text-black py-4">
            <div className="flex items-center justify-center mx-auto rounded-full w-12 h-12    bg-blue-500/10 text-blue-500 ">
              <Wallet2 />
            </div>
            <h5 className="mt-4 mb-2 font-bold">
              <CountUp
                end={mavuno?.stats?.total_payments_this_year}
                className="counter-value"
              />
            </h5>
            <p className="text-slate-500 font-bold">
              Jumla makusanyo mwaka huu
            </p>
          </div>
        </div>
        <div className=" shadow-lg rounded-lg">
          <div className="text-center bg-white text-black py-4">
       
            <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full  w-12 h-12  dark:bg-red-500/20">
              <EqualIcon />
            </div>
            <p className="text-slate-500 font-bold mt-4 mb-2">
              <CountUp
                end={mavuno?.stats.top_performing_jumuiya.total_collected}
                className="counter-value"
              />
            </p>
            <h5 className="text-slate-500 font-bold">Jumuiya
            {' '}  {mavuno?.stats.top_performing_jumuiya.jumuiya_name}
            </h5>
         
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Widgets;
