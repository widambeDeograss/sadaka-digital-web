import {Card, Col, Row} from "antd";
import LineChart from "../../components/chart/lineChart.tsx";
import {TransactionOutlined} from "@ant-design/icons";

const Muhumini = () => {
  return(
      <div className="mt-14">
          <Row gutter={[24, 0]} className="mb-5">
              <Col xs="24" xl={5}>
                  <div className="bg-white p-1 h-32 rounded-lg   mb-1 hover:scale-105 transition-transform"

                  >
                      <div className='flex flex-col justify-center items-center mt-5 text-black'>
                          <TransactionOutlined style={{ fontSize: '22px' }}/>
                          <h3 className='font-bold text-sm mt-3'>Jumla Sadaka</h3>
                          <h3 className='font-bold text-xs '>160,000/=</h3>
                      </div>
                  </div>
              </Col>
              <Col xs="24" xl={5}>
                  <div className="bg-white p-1  h-32 rounded-lg   mb-1 hover:scale-105 transition-transform"

                  >
                      <div className='flex flex-col justify-center items-center mt-5 text-black'>
                          <TransactionOutlined style={{ fontSize: '22px' }}/>
                          <h3 className='font-bold text-sm mt-3'>Jumla Zaka</h3>
                          <h3 className='font-bold text-xs '>20,000,000/=</h3>
                      </div>
                  </div>
              </Col>
              <Col xs="24" xl={5}>
                  <div className="bg-white p-1 h-32 rounded-lg   mb-1 hover:scale-105 transition-transform"

                  >
                      <div className='flex flex-col justify-center items-center mt-5 text-black'>
                          <TransactionOutlined style={{ fontSize: '22px' }}/>
                          <h3 className='font-bold text-sm mt-3'>Jumla Michango</h3>
                          <h3 className='font-bold text-xs '>80,5600,000/=</h3>
                      </div>
                  </div>
              </Col>
              <Col xs="24" xl={5}>
                  <div className="bg-white p-1 h-32 rounded-lg   mb-1 hover:scale-105 transition-transform"

                  >
                      <div className='flex flex-col justify-center items-center mt-5 text-black'>
                          <TransactionOutlined style={{ fontSize: '22px' }}/>
                          <h3 className='font-bold text-sm mt-3'>Jumla Ahadi</h3>
                          <h3 className='font-bold text-xs '>5600,000/=</h3>
                      </div>
                  </div>
              </Col>

          </Row>
          <Card
              title="Matoleo ya Muhumini"
          >
              <h3 className="text-sm font-bold text-left" >JINA LA MUHUMINI:  <span className="text-gray-800">DEOGRASS WIDAMBE</span></h3>

              <div className="mt-5">
                  <LineChart />
              </div>
          </Card>

      </div>
  )
}

export default Muhumini;
