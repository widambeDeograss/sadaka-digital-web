
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./config/lineChart";
import { fetchSadataZakaStats } from "../../helpers/ApiConnectors";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";

function LineChart() {
  const { Title, Paragraph } = Typography;
  const church = useAppSelector((state: any) => state.sp)

  const {
    data: zaka_sadaka,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["zaka_totals"],
    queryFn: async () => {
      let query = `?church_id=${church.id}&&type=zaka_sadaka`;
      const response: any = await fetchSadataZakaStats(query);
      return response;
    },
    // {?
    //   enabled: false,
    // }
  });


  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: Unable to fetch data</div>;

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
        series={zaka_sadaka?.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
