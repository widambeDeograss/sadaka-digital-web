import React from 'react';
import {  Wallet2,BanknoteIcon, Table2Icon, EqualIcon } from 'lucide-react';
import CountUp from 'react-countup';
import { fetchSadataZakaStats } from '../../helpers/ApiConnectors';
import { useAppSelector } from '../../store/store-hooks';
import { useQuery } from '@tanstack/react-query';
import { GlobalMethod } from '../../helpers/GlobalMethods';

const Widgets = () => {

    const church = useAppSelector((state: any) => state.sp);
    const userPermissions = useAppSelector(
        (state: any) => state.user.userInfo.role.permissions
      );
    const {
        data: zaka_totals,
        isLoading,
      } = useQuery({
        queryKey: ["zaka_totals"],
        queryFn: async () => {
          let query = `?church_id=${church.id}&&type=zaka_totals`;
          const response: any = await fetchSadataZakaStats(query);
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
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto rounded-full w-12 h-12    bg-blue-500/10 text-blue-500 ">
                        <Wallet2 />
                    </div>
                    <h5 className="mt-4 mb-2 font-bold">
                        <CountUp end={zaka_totals?.total_cash} decimals={2} className="counter-value" />
                        </h5>
                    <p className="text-slate-500 ">Cash</p>
                </div>
            </div>
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-purple-500 bg-purple-100 rounded-full  w-12 h-12  dark:bg-purple-500/20">
                        <BanknoteIcon />
                    </div>
                    <h5 className="mt-4 mb-2 font-bold"><CountUp end={zaka_totals?.total_other} decimals={2} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Others payment types</p>
                </div>
            </div>
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-green-500 bg-green-100 rounded-full  w-12 h-12  dark:bg-green-500/20">
                        <Table2Icon />
                    </div>
                    <h5 className="mt-4 mb-2 font-bold"><CountUp end={zaka_totals?.total_today} decimals={2} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Jumla mwezi huu</p>
                </div>
            </div>
                {GlobalMethod.hasAnyPermission(
                                         ["MANAGE_ZAKA"],
                                         GlobalMethod.getUserPermissionName(userPermissions)
                                       ) && (
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full  w-12 h-12  dark:bg-red-500/20">
                        <EqualIcon />
                    </div>
                    <h5 className="mt-4 mb-2  font-bold"><CountUp end={zaka_totals?.total_year} decimals={2} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Jumla</p>
                </div>
            </div>
            )}
           
            </div>
        </React.Fragment>
    );
};

export default Widgets;
