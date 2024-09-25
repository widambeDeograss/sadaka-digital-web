import {
  Row,
  Col,
  Card,
  Table,
  Typography, Button, Select, Progress,
} from "antd";
import {
    DownloadOutlined, TransactionOutlined,
} from '@ant-design/icons';
import EChart from "../../components/chart/bChart.tsx";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import {useNavigate} from "react-router-dom";
import Widgets from "./Stats.tsx";
import Tabletop from "../../components/tables/TableTop.tsx";


const data = [
  {
    id:1,
    name:'Ujenzi',
    kadirio:200000000,
    parcentage:50,
    jumla:10000000,


  }
]

function Michango() {
    const navigate = useNavigate();
  return (
      <div className="tabled ">
        <Widgets/>
        <Card
        className="mt-5"
              title={<h3 className="font-bold text-sm text-left ">Michango</h3>}
          >
              <div>

                  <div className="flex justify-between flex-wrap mt-5">
                      <div>
                          <h3 className="text-left font-bold text-xs">Tarehe: <span>{new Date().toDateString()}</span></h3></div>
                      <div>
                      <Button type="primary" className="bg-[#152033] text-white text-xs">Ongeza Changizo</Button>

                      </div>
                  </div>
              </div>

          </Card>
        <Row gutter={[24, 0]} className="mt-5">
          <Col xs="24" xl={24}>
            <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title={<h3 className="font-bold text-sm text-left">Michango iliyopo</h3>}
                extra={
                  <>
                    <Search placeholder={"jina la mchango.."} size="small"/>
                  </>
                }
            >
              <div className="table-responsive">
                <Tabletop/>
                <Table
                    dataSource={data}
                    className="ant-border-space"
                >
                  <Column title="Mchango" dataIndex="name" key="name" />
                  <Column title="Lengo" dataIndex="kadirio" key="kadirio" />

                  <Column title="kufikia lengo" dataIndex="parcentage" key="parcentage"
                  render={(parcentage) => <Progress percent={parcentage} size="small" />}
                  />
                  <Column title="Jumla ya makusanyo" dataIndex="jumla" key="jumla" />
                  <Column
                      dataIndex="id"
                      key="id"
                      render={(id) =>
                          <div>

                            <Button
                                onClick={ () => {
                                 navigate(`/dashboard/mchango/${id}`)
                                }}
                                type="dashed" color="danger"
                            >Edit</Button>
                            <Button
                                onClick={ () => {

                                }}
                                type="dashed" color="danger"
                            >View</Button>
                          </div>
                      }
                  />
                </Table>
              </div>
            </Card>


          </Col>
        </Row>
      </div>
  )
}

export default Michango
