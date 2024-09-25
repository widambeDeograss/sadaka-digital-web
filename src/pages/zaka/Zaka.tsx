import {Button, Card, Select, Table, Typography} from "antd";
import Column from "antd/es/table/Column";
import OngezaZaka from "./OngezaZakaModal";
import { useState } from "react";
import Widgets from "./Stats";
import Tabletop from "../../components/tables/TableTop";

const michango = [
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    }
]
const Zaka = () => {
    const [openMOdal, setopenMOdal] = useState(false);

  return(
      <div className="">
        <Widgets/>
          <Card
              title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
          >
              <div className="text-xs">
                  <h3 className="text-left">Tarehe: <span>{new Date().toDateString()}</span></h3>
                  <div className="flex justify-between flex-wrap mt-3">
                      <div>
                          <Button.Group className="mt-5">
                              <Button type="primary" className="bg-[#152033] text-white" onClick={() => setopenMOdal(true)} >Ongeza zaka</Button>
                              {/* </Radio.Button> */}
                          </Button.Group>
                      </div>
                  </div>
              </div>

          </Card>
          <Card title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
                className="mt-5">
              <div className="">
                <Tabletop/>
                  <Table
                      dataSource={michango}
                      className="ant-border-space table-responsive"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                      <Column title="Zaka" dataIndex="changio" key="changio"

                      />
                      <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                  </Table>
              </div>
          </Card>
          <OngezaZaka openMOdal={openMOdal} handleCancel={()=> setopenMOdal(!openMOdal)}  />
      </div>
  )
}

export default Zaka;
