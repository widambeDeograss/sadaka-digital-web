
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./config/lineChart";

function LineChart() {
  const { Title, Paragraph } = Typography;


    return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Matoleo</Title>
          <Paragraph className="lastweek">
            Ongezeko la  <span className="bnb2">+5.5%</span> kwa mwezi
          </Paragraph>
        </div>
        <div className="sales ">
          <ul>
            <li className="text-xs">{<MinusOutlined />} Zaka</li>
            <li className="text-xs">{<MinusOutlined />} Sadaka</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
          // @ts-ignore
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
