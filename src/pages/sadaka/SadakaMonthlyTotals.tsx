import React, {  useState, useMemo } from "react";
import { Table, Card } from "antd";
import { useAppSelector } from "../../store/store-hooks";
import { resolveSadakaTotals } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import Tabletop from "../../components/tables/TableTop";

// Interface based on your Sadaka data structure
interface WeekData {
  week_start: string;
  week_end: string;
  total_sadaka: number;
}

interface SadakaData {
  card_no: string;
  mhumini_first_name: string;
  mhumini_last_name: string;
  weekly_sadaka: WeekData[];
}

const SadakaReportTable: React.FC = () => {
  const church = useAppSelector((state: any) => state.sp);
  const [data, setData] = useState<SadakaData[]>([]);

  // Fetch sadaka report data using react-query with error handling
  const { data: sadaka, isLoading, error } = useQuery({
    queryKey: ["sadakaTotals", church?.id],
    queryFn: async () => {
      if (!church?.id) return [];
      const response:any = await resolveSadakaTotals(`?church_id=${church.id}`);
      setData(response);
      return response;
    },
  });

  // Memoize columns for performance optimization
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const weeksColumns = data[0].weekly_sadaka.map((week: WeekData) => ({
      title: `${week.week_start} to ${week.week_end}`,
      dataIndex: "weekly_sadaka",
      key: `${week.week_start}-${week.week_end}`,
      render: (weekly_sadaka: WeekData[]) => {
        const weekData = weekly_sadaka.find(
          (w) => w.week_start === week.week_start && w.week_end === week.week_end
        );
        return weekData ? weekData.total_sadaka || 0 : 0;
      },
    }));

    return [
      {
        title: "Card Number",
        dataIndex: "card_no",
        key: "card_no",
      },
      {
        title: "Member Name",
        key: "member_name",
        render: (record: SadakaData) =>
          `${record.mhumini_first_name} ${record.mhumini_last_name}`,
      },
      ...weeksColumns, 
    ];
  }, [data]);

  return (
    <Card
      title={<h3 className="font-bold text-sm text-left ">Matoleo ya Sadaka</h3>}
      className="mt-5"
    >
      <div className="table-responsive">
        <Tabletop
          inputfilter={false}
          togglefilter={() => {
            /* Add filter functionality if needed */
          }}
        />
        <Table
          columns={columns}
          dataSource={sadaka}
          loading={isLoading}
          rowKey="card_no"
          pagination={false}
          bordered
        />
      </div>
    </Card>
  );
};

export default SadakaReportTable;
