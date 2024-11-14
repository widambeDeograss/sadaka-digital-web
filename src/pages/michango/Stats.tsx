import React from "react";
import CountUp from "react-countup";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchMichangoStats } from "../../helpers/ApiConnectors";
import { Progress } from "antd";

const Widgets = () => {
  const church = useAppSelector((state: any) => state.sp);

  const {
    data: mchango_totals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mchango_totals"],
    queryFn: async () => {
      let query = `?church_id=${church.id}&&type=mchango_totals`;
      const response: any = await fetchMichangoStats(query);
      return response;
    },
  });


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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {mchango_totals?.map((mchango: any, index: number) => (
          <div className="card" key={index}>
            <div className="card-body">
              <div className="grid grid-cols-12">
                <div className="col-span-8 md:col-span-9">
                  <p className="text-slate-500 font-bold ">
                    {mchango.mchango_name}
                  </p>
                  <h5 className="mt-3 mb-4">
                    <CountUp
                      end={parseFloat(mchango.collected_amount)}
                      className="counter-value"
                    />
                  </h5>
                </div>
                <div className="col-span-4 md:col-span-3">
                <Progress percent={ mchango?.percentage_collected} size="default" type="circle" className="justify-start"/>
              
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <p className="text-slate-500 font-bold grow">
                  <span className="font-medium text-green-500">
                    { mchango?.percentage_collected}
                    %
                  </span>{" "}
                  Collected
                </p>
                <p className="text-slate-500 font-bold ">Mwezi huu</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Widgets;
