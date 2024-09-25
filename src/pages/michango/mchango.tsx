import {Button, Card,  Progress,  Select, Table, Typography} from "antd";
import LineChart from "../../components/chart/lineChart.tsx";
import Column from "antd/es/table/Column";
import {DownloadOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";

const michango = [
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    }
]

const ahadi = [
    {
        id:1,
        name:'Michael Michael',
        phone:"0716058802",
        ahadi:500000,
        tarehe:"1/11/2023",
        parcentage:0,
        iliyolipwa:0,
        anayodaiwa:50000
    }
]
const Mchango = () => {
  return(
      <div>
          <Card
              title={<h3 className="text-sm font-bold  ">Mchango wa Ujenzi wa kanisa</h3>}
              className="mt-14"
          >

              <h3 className="text-sm font-bold text-left" >Jumla ya Makusanyo:  <span className="text-gray-800">20,000,000/= Tzs</span></h3>
              <h3 className="text-sm font-bold text-left" >Jumla ya Ahadi:  <span className="text-gray-800">5,000,000/= Tzs</span></h3>
              <div>
                  <h3 className="text-sm font-bold text-left" >Asilimia</h3>
                  <Progress percent={50} size="small" />
              </div>

                 <div className="mt-5">
                  <LineChart />
              </div>
          </Card>


          <Card title={<h3 className="text-sm font-bold text-left">Michango</h3>}
                extra={ <Button.Group>
                    <Typography.Text className="mt-1 mr-2 font-extrabold">Filter:</Typography.Text>
                    {/* <Radio.Button> */}
                    <Select
                        defaultValue="All"
                        style={{ width: 90, height: "auto" }}
                        // loading
                        options={[
                            { value: "All", label: "All" },
                            { value: "November", label: "November" },
                            { value: "October", label: "October" },
                        ]}
                    />
                    <Button type="primary" className="bg-[#152033] text-white text-xs"  icon={<DownloadOutlined />}>Download CSV</Button>
                    <Button type="primary" className="bg-[#152033] text-white text-xs">Ongeza Changizo</Button>
                    {/* </Radio.Button> */}
                </Button.Group>}
                className="mt-5">
              <div className="">
                  <Table
                      dataSource={michango}
                      className="ant-border-space table-responsive"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                      <Column title="Changio" dataIndex="changio" key="changio"

                      />
                      <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                  </Table>
              </div>
          </Card>
          <Card
          title={<h3 className="text-sm font-bold text-left">Ahadi</h3>}
          className="mt-5"
          extra={
              <>
                  <Search placeholder={"jina la mchango.."} size="small"/>
              </>
          }
          >
              <div className="table-responsive">
                  <Table
                      dataSource={ahadi}
                      className="ant-border-space table-responsive"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />



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
      </div>
  )
}

export default Mchango;
