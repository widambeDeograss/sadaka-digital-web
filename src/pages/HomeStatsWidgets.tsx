import React from 'react';
import { ChevronDown, Cog, Coins, Kanban, ListFilter, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

const Widgets = () => {
    return (
        <React.Fragment>
            <div className='grid grid-cols-4 gap-3'>
            <div className=" bg-green-100  card 2xl:col-span-2 border-green-500/20 relative overflow-hidden">
                <div className="card-body text-white">
                    <Kanban className="absolute top-0 size-32 stroke-1 text-green-200/50  ltr:-right-10 rtl:-left-10"></Kanban>
                    <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-md text-15 text-green-50">
                        <Users />
                    </div>
                    <h5 className="mt-5 mb-2 ">
                        <CountUp end={15876} className="counter-value" />
                    </h5>
                    <p className="text-slate-500 font-bold">Total Users</p>
                </div>
            </div>
            <div className="order-2  2xl:order-1 bg-orange-100  card 2xl:col-span-2 border-orange-500/20 relative overflow-hidden">
                <div className="card-body">
                    <ListFilter className="absolute top-0 size-32 stroke-1 text-orange-200/50  ltr:-right-10 rtl:-left-10"></ListFilter>
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-md text-15 text-orange-50">
                    <Cog />
                    </div>
                    <h5 className="mt-5 mb-2">
                        <CountUp end={103.15} decimals={2} className="counter-value" />
                        k</h5>
                    <p className="text-slate-500 dark:text-slate-200">Sessions</p>
                </div>
            </div>
            <div className="order-3  2xl:order-1 bg-sky-100  card 2xl:col-span-2 border-blue-500/20 relative overflow-hidden">
                <div className="card-body">
                    <ListFilter className="absolute top-0 size-32 stroke-1  text-blue-500/20 ltr:-right-10 rtl:-left-10"></ListFilter>
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-sky-500 text-15 text-sky-50">
                        <Coins />
                    </div>
                    <h5 className="mt-5 mb-2">
                    <CountUp className="counter-value" end={1} duration={3} />M{' '}
                    <CountUp className="counter-value" end={29} duration={3} />sec
                        </h5>
                    <p className="text-slate-500 dark:text-slate-200">Avg. Visit Duration</p>
                </div>
            </div>

            <div className="order-4  2xl:order-1 bg-purple-100  card 2xl:col-span-2 border-purple-500/20 relative overflow-hidden">
                <div className="card-body">
                    <Kanban className="absolute top-0 size-32 stroke-1 text-purple-200/50  ltr:-right-10 rtl:-left-10"></Kanban>
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-md text-15 text-purple-50">
                        <Users />
                    </div>
                    <h5 className="mt-5 mb-2">
                    <CountUp end={49.77} decimals={2} className="counter-value" />%
                        </h5>
                    <p className="text-slate-500 dark:text-slate-200">Bounce Rate</p>
                </div>
            </div>
       
            </div>
        </React.Fragment>
    );
};

export default Widgets;
