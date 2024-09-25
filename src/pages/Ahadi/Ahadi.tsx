import {Button, Card, Col, Progress, Row, Select, Table, Typography} from "antd";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import OngezaAhadi from "./OngezaAhadi";
import { useState } from "react";
import {TransactionOutlined} from "@ant-design/icons";
import Widgets from "./Stats";
import Tabletop from "../../components/tables/TableTop";


const ahadi = [
    {
        id:1,
        name:'Michael Michael',
        phone:"0716058802",
        mchango:"Ujenzi",
        ahadi:500000,
        tarehe:"1/11/2023",
        parcentage:0,
        iliyolipwa:0,
        anayodaiwa:50000
    }
]

const Ahadi = () => {

    const [openMOdal, setopenMOdal] = useState(false);
  return(
      <div className="">
        <Widgets/>
          <Card
              title={<h3 className="font-bold text-sm text-left">Ahadi</h3>}
          >
              <div>

                  <div className="flex justify-between mt-3">
                      <div>
                          <h3 className="text-left font-bold text-xs">Tarehe: <span>{new Date().toDateString()}</span></h3></div>
                      <div>
                          <Button.Group>
                      
                              <Button type="primary" className="bg-[#152033] text-white"  onClick={() => {setopenMOdal(true)}}>Ongeza Ahadi</Button>
                              {/* </Radio.Button> */}
                          </Button.Group>
                      </div>
                  </div>
              </div>

          </Card>
          <Card
              title={<h3 className="text-sm font-bold text-left">Ahadi</h3>}
              className="mt-5"
           
          >
              <div className="">
                <Tabletop/>
                  <Table
                      dataSource={ahadi}
                      className="ant-border-space table-responsive"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                      <Column title="Mchango" dataIndex="mchango" key="mchango"

                      />

                      <Column title="Ahadi" dataIndex="ahadi" key="ahadi"

                      />
                      <Column title="kutimiza ahadi" dataIndex="parcentage" key="parcentage"
                              render={(parcentage) => <Progress percent={parcentage} size="small" />}
                      />
                      <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />


                      <Column title="Iliyolipwa" dataIndex="iliyolipwa" key="iliyolipwa" />
                      <Column title="Anayodaiwa" dataIndex="anayodaiwa" key="anayodaiwa" />
                  </Table>
              </div>
          </Card>

          <OngezaAhadi openMOdal={openMOdal} handleCancel={()=> setopenMOdal(!openMOdal)}  />
      </div>
  )
}

export default Ahadi;
