import {Button, Card, Select, Table, Typography} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import Column from "antd/es/table/Column";
import Search from "antd/es/input/Search";
import AddExpenseModal from "./AddExpModal.tsx";
import { useState } from "react";
import Tabletop from "../../components/tables/TableTop.tsx";
import Widgets from "./Stats.tsx";

const michango = [
    {
        id:1,
        name:'Mapambo Ukimbi wa mikutano',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    }
]
const Expenses = () => {
    const [openMOdal, setopenMOdal] = useState(false);


    return(
        <div className="">
            <Widgets/>
            <Card
                title={<h3 className="font-bold text-sm text-left ">Matumizi</h3>}
            >
                <div className="text-xs">
                    <h3 className="text-left">Tarehe: <span>{new Date().toDateString()}</span></h3>
                    <div className="flex justify-between flex-wrap mt-3">
                        <div><h3 className="text-left">Matumizi za mwezi: <span>2,000,000/=</span></h3>
                            <h3 className="text-left"> Matumizi mwaka huu: <span>30,0000,000/=</span></h3></div>
                        <div>
                            <Button.Group className="mt-5">
                                <Button type="primary" className="bg-[#152033] text-white" onClick={() => setopenMOdal(true)} >Ongeza Matumizi </Button>
                                {/* </Radio.Button> */}
                            </Button.Group>
                        </div>
                    </div>
                </div>

            </Card>


            <Card title={<h3 className="font-bold text-sm text-left ">Matumizi</h3>}
                  className="mt-5">
                <div className="">
                    <Tabletop/>
                    <Table
                        dataSource={michango}
                        className="ant-border-space table-responsive"
                    >
                        <Column title="Jina la matumizi" dataIndex="name" key="name" />
                        <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                        <Column title="Kiasi" dataIndex="changio" key="changio"

                        />
                        <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                    </Table>
                </div>
            </Card>
            <AddExpenseModal openMOdal={openMOdal} handleCancel={()=> setopenMOdal(!openMOdal)}  />
        </div>
    )
}

export default Expenses;
