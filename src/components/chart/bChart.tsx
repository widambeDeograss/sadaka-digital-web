import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
import eChart from "./config/bchart";

function EChart() {
  const { Title, Paragraph } = Typography;

  const items = [
    {
      Title: "3,6K",
      user: "Wahumini",
    },
    {
      Title: "2m",
      user: "Ujenzi",
    },
    {
      Title: "30m Tsh",
      user: "Makusanyo jumla",
    },
    {
      Title: "12",
      user: "Michango",
    },
  ];

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
            // @ts-ignore
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>Michango</Title>
        <Paragraph className="lastweek text-xs">
          Ongezeko <span className="bnb2">+30%</span>
        </Paragraph>
        <Paragraph className="lastweek text-xs" >
          We have created multiple options for you to put together and customise
          into pixel perfect pages.
        </Paragraph>
        <Row >
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4}>{v.Title}</Title>
                <span>{v.user}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
