import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
import eChart from "./config/bchart";
import { useAppSelector } from "../../store/store-hooks";
import { fetchMichangoStats } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";

function EChart() {
  const { Title, Paragraph } = Typography;

  const church = useAppSelector((state: any) => state.sp);

  const {
    data: mchango_totals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mchango_stats"],
    queryFn: async () => {
      let query = `?church_id=${church.id}&&type=mchango_stats`;
      const response: any = await fetchMichangoStats(query);
      return response;
    },
  });

  const {
    data: mchango_stats,
  } = useQuery({
    queryKey: ["mchango_totals"],
    queryFn: async () => {
      let query = `?church_id=${church.id}&&type=mchango_totals`;
      const response: any = await fetchMichangoStats(query);
      return response;
    },
  });


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: Unable to fetch data</div>;
  console.log(mchango_totals);
  

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
            // @ts-ignore
          options={eChart.options}
          series={mchango_totals?.area_chart_data?.series}
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
          {mchango_stats?.map((v:any, index:number) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={5}>{v?.percentage_collected}%</Title>
                <span>{v.mchango_name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
