import {Button, Card, Col, Row, Select, Table, Timeline, Typography} from "antd";
import {DownloadOutlined, TransactionOutlined} from "@ant-design/icons";
import {useState} from "react";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import OngezaSadaka from "./OngezaSadaka.tsx";
import Widgets from "./Stats.tsx";
import Tabletop from "../../components/tables/TableTop.tsx";

const timelineList = [
    {
        title: "Tsh 2500 - Michael card:20221",
        time: "09 JUN 7:20 PM",
        color: "green",
    },
    {
        title: "Tsh 2500 - Michael card:20221",
        time: "09 JUN 7:20 PM",
        color: "green",
    },
    {
        title: "Tsh 2500 - Michael card:20221",
        time: "09 JUN 7:20 PM",
    },

];
const sadaka = [
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    },
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    },
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    },
]
const {Title, Paragraph, Text} = Typography;
const Sadaka = () => {
    const [reverse, setReverse] = useState(false);
    const [openMOdal, setopenMOdal] = useState(false);

  return(
      <div>
       
         <Widgets/>
    
          <Card
              title={<h3 className="font-bold text-sm text-left">Sadaka</h3>}
          >
              <div>

                  <div className="flex justify-between flex-wrap mt-5">
                      <div>
                          <h3 className="text-left font-bold text-xs">Tarehe: <span>{new Date().toDateString()}</span></h3></div>
                      <div>
                          <Button type="primary" className="bg-[#152033] text-white text-xs"  onClick={() => setopenMOdal(true)} >Ongeza Sadaka</Button>

                      </div>
                  </div>
              </div>

          </Card>
          <Row gutter={24} className="mt-5">
              <Col xs={24} sm={24} md={12} lg={12} xl={16} className="">

                  <Card title={<h3 className=" text-sm text-left">Sadaka za Leo </h3>}
                        className="mt-5">
                      <div className="table-responsive">
                      <Tabletop showFilter={false}/>
                          <Table
                              dataSource={sadaka}
                              className="ant-border-space table-responsive "

                          >
                              <Column title="Jina la muhumini" dataIndex="name" key="name" />
                              <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                              <Column title="Sadaka" dataIndex="changio" key="changio"

                              />
                              <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                          </Table>
                      </div>
                  </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={8} className="">
                  <Card bordered={false} className="criclebox h-full">
                      <div className="timeline-box">
                          <h3 className=" text-sm text-left font-bold">Matoleo leo</h3>
                          <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                              this month <span className="bnb2">20%</span>
                          </Paragraph>

                          <Timeline
                              pending="Matoleo..."
                              className="timelinelist lastweek text-xs "
                              reverse={reverse}
                          >
                              {timelineList.map((t, index) => (
                                  <Timeline.Item color={t.color} key={index}>
                                      <h3 className=" text-xs text-center ">{t.title}</h3>
                                      <Text>{t.time}</Text>
                                  </Timeline.Item>
                              ))}
                          </Timeline>
                          <Button
                              type="primary"
                              className="width-100 text-xs bg-blue-600"
                              onClick={() => setReverse(!reverse)}
                          >
                               REVERSE
                          </Button>
                      </div>
                  </Card>
              </Col>
          </Row>

          <Card title={ <h3 className=" text-sm text-left font-bold">Sadaka</h3>}
                className="mt-5">
              <div className="">

                <Tabletop/>
                  <Table
                      dataSource={sadaka}
                      className="ant-border-space table-responsive text-xs"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                      <Column title="Sadaka" dataIndex="changio" key="changio"

                      />
                      <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                  </Table>
              </div>
          </Card>
          {/* <Card title={ <h3 className=" text-sm text-left font-bold">Sadaka za mwaka</h3>}
                className="mt-5">
              <div className="">
                <Tabletop/>
                  <Table
                      dataSource={sadaka}
                      className="ant-border-space table-responsive"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                      <Column title="Sadaka" dataIndex="changio" key="changio"

                      />
                      <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                  </Table>
              </div>
          </Card> */}
          <OngezaSadaka openMOdal={openMOdal} handleCancel={()=> setopenMOdal(!openMOdal)}  />
      </div>
  )
}

export default Sadaka;
