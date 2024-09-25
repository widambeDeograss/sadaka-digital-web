import {Button, Card, Col,  Row,  Table, } from "antd";
import Column from "antd/es/table/Column";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router-dom";
import Tabletop from "../../components/tables/TableTop";



const michango = [
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        nambayakadi:"2343CD",
        changio:500000,
        ahadi:3400000,
        dob:"1/11/2023",

    }
]
const Wahumini = () => {
    const navigate = useNavigate();
  return(
      <div>
          <Card
              title={<h3 className="font-bold text-sm text-left">Wahumini</h3>}
              className=""
          >
              <div>

                  <div className="flex justify-between mt-3">
                      <div>
                          <h3 className="text-left font-bold text-xs">Jumla Wahumini: <span>3000</span></h3></div>
                      <div>
                          <Button.Group>
                              <Button type="primary" className="bg-[#152033] text-white text-xs"
                              onClick={() => navigate("/dashboard/wahumini/ongeza")}
                              >Ongeza Muhumini</Button>
                              {/* </Radio.Button> */}
                          </Button.Group>
                      </div>
                  </div>
              </div>

          </Card>

          <Row gutter={[24, 0]} className="mt-5">
              <Col xs="24" xl={24}>
                  <Card
                      bordered={false}
                    //   className="criclebox tablespace mb-24"
                      title="Wahumini"
                   
                  >
                      <div className="table-responsive">
                        <Tabletop/>
                          <Table
                              dataSource={michango}
                              className="ant-border-space"
                          >
                              <Column title="Jina la muhumini" dataIndex="name" key="name" />
                              <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                              <Column title="Jumla Michango" dataIndex="changio" key="changio"
                              />
                              <Column title="Jumla Ahadi" dataIndex="ahadi" key="ahadi"
                              />
                              <Column title="Tarehe" dataIndex="dob" key="dbo" />
                              <Column
                                  dataIndex="id"
                                  key="id"
                                  render={(id) =>
                                      <div>

                                          <Button
                                              onClick={ () => {
                                                  navigate(`/dashboard/muhumini/${id}`)
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

export default Wahumini;
