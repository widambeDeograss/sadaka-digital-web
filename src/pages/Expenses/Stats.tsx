import React from 'react';
import { Package, PackageX, Truck, Wallet2,BanknoteIcon, Table2Icon, EqualIcon } from 'lucide-react';
import CountUp from 'react-countup';

const Widgets = () => {
    return (
        <React.Fragment>
             <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-3 mb-3">
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto rounded-full w-12 h-12    bg-blue-500/10 text-blue-500 ">
                        <Wallet2 />
                    </div>
                    <h5 className="mt-4 mb-2 font-bold">
                        <CountUp end={236000.18} decimals={2} className="counter-value" />Tzs
                        </h5>
                    <p className="text-slate-500 ">Ujenzi</p>
                </div>
            </div>
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-purple-500 bg-purple-100 rounded-full  w-12 h-12  dark:bg-purple-500/20">
                        <BanknoteIcon />
                    </div>
                    <h5 className="mt-4 mb-2 font-bold"><CountUp end={3000000} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Watoto</p>
                </div>
            </div>
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-green-500 bg-green-100 rounded-full  w-12 h-12  dark:bg-green-500/20">
                        <Table2Icon />
                    </div>
                    <h5 className="mt-4 mb-2 font-bold"><CountUp end={17150} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Nyinginezo</p>
                </div>
            </div>
            <div className="">
                <div className="text-center bg-white text-black py-4">
                    <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full  w-12 h-12  dark:bg-red-500/20">
                        <EqualIcon />
                    </div>
                    <h5 className="mt-4 mb-2  font-bold"><CountUp end={3519} className="counter-value" /></h5>
                    <p className="text-slate-500 dark:text-zink-200">Kwaya</p>
                </div>
            </div>
            </div>
        </React.Fragment>
    );
};

export default Widgets;
