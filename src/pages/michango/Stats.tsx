import React from 'react';
import { TotalEmployeeChart } from '../../components/chart/MichangoChart';
import CountUp from 'react-countup';

const Widgets = () => {
    return (
        <React.Fragment>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
            <div className=" card">
                <div className="card-body">
                    <div className="grid grid-cols-12">
                        <div className="col-span-8 md:col-span-9">
                            <p className="text-slate-500 font-bold ">Total Ujenzi</p>
                            <h5 className="mt-3 mb-4">
                                <CountUp end={615} className="counter-value" />
                            </h5>
                        </div>
                        <div className="col-span-4 md:col-span-3">
                            <TotalEmployeeChart chartId="totalEmployee" dataChartColor='["bg-custom-500"]' series={[10]} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <p className="text-slate-500 font-bold  grow"><span className="font-medium text-green-500">15%</span> Increase</p>
                        <p className="text-slate-500 font-bold ">Mwezi huu</p>
                    </div>
                </div>
            </div>
            <div className=" card">
                <div className="card-body">
                    <div className="grid grid-cols-12">
                        <div className="col-span-8 md:col-span-9">
                            <p className="text-slate-500 font-bold ">Jumla Kwaya</p>
                            <h5 className="mt-3 mb-4">  <CountUp end={174} className="counter-value" /></h5>
                        </div>
                        <div className="col-span-4 md:col-span-3">
                            <TotalEmployeeChart chartId="totalApplication" dataChartColor='["bg-purple-500"]' series={[60]} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <p className="text-slate-500 font-bold  grow"><span className="font-medium text-green-500">26%</span> Increase</p>
                        <p className="text-slate-500 font-bold ">This Month</p>
                    </div>
                </div>
            </div>

            {/* <ApplicationReceived /> */}

            <div className=" card">
                <div className="card-body">
                    <div className="grid grid-cols-12">
                        <div className="col-span-8 md:col-span-9">
                            <p className="text-slate-500 font-bold ">Jumla vyombo vya muziki</p>
                            <h5 className="mt-3 mb-4"> <CountUp end={64} className="counter-value" /></h5>
                        </div>
                        <div className="col-span-4 md:col-span-3">
                            <TotalEmployeeChart chartId="hiredCandidates" dataChartColor='["bg-green-500"]' series={[25]} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <p className="text-slate-500 font-bold  grow"><span className="font-medium text-red-500">05%</span> Increase</p>
                        <p className="text-slate-500 font-bold ">Mwezi huu</p>
                    </div>
                </div>
            </div>
            <div className=" card">
                <div className="card-body">
                    <div className="grid grid-cols-12">
                        <div className="col-span-8 md:col-span-9">
                            <p className="text-slate-500 font-bold ">Kusaidia wasio jiweza</p>
                            <h5 className="mt-3 mb-4"><CountUp end={110} className="counter-value" /></h5>
                        </div>
                        <div className="col-span-4 md:col-span-3">
                            <TotalEmployeeChart chartId="rejectedCandidates" dataChartColor='["bg-red-500"]' series={[75]} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <p className="text-slate-500 font-bold  grow"><span className="font-medium text-red-500">16%</span> Increase</p>
                        <p className="text-slate-500 font-bold ">This Month</p>
                    </div>
                </div>
            </div>
            </div>
        </React.Fragment>
    );
};

export default Widgets;
