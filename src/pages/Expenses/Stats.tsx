import React from 'react';
import {  Wallet2, EqualIcon } from 'lucide-react';
import CountUp from 'react-countup';
import { fetchMatumiziStats } from '../../helpers/ApiConnectors';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../store/store-hooks';

const Widgets = () => {
    const church = useAppSelector((state: any) => state.sp);

    const {
        data: expenses,
        isLoading,
      } = useQuery({
        queryKey: ["expence_stats"],
        queryFn: async () => {
          let query = `?church_id=${church.id}`;
          const response: any = await fetchMatumiziStats(query);
          return response;
        },
        // {?
        //   enabled: false,
        // }
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
             <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-3 mb-3">
             {
                expenses?.category_totals.map((ex:any, index:number)=> {
                    return  <div className="" key={index}>
                    <div className="text-center bg-white text-black py-4">
                        <div className="flex items-center justify-center mx-auto rounded-full w-12 h-12    bg-blue-500/10 text-blue-500 ">
                            <Wallet2 />
                        </div>
                        <h5 className="mt-4 mb-2 font-bold">
                            <CountUp end={ex?.total_spent} decimals={2} className="counter-value" />Tzs
                            </h5>
                        <p className="text-slate-500 ">{ex?.category_name}</p>
                    </div>
                </div>
                })
             }
        
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full  w-12 h-12  dark:bg-red-500/20">
                        <EqualIcon />
                    </div>
                    <h5 className="mt-4 mb-2  font-bold"><CountUp end={expenses?.total_spent} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Jumla matumizi</p>
                </div>
            </div>
            </div>
        </React.Fragment>
    );
};

export default Widgets;
